// 初始化本地存储
const chatHistory = {
    init() {
        this.histories = JSON.parse(localStorage.getItem('chatHistories')) || [];
        this.currentHistoryId = localStorage.getItem('currentHistoryId');
        
        if (!this.currentHistoryId) {
            this.createNewHistory();
        }
    },
    
    createNewHistory() {
        const historyId = Date.now().toString();
        const newHistory = {
            id: historyId,
            messages: [],
            createdAt: new Date().toISOString()
        };
        
        this.histories.push(newHistory);
        this.currentHistoryId = historyId;
        this.save();
    },
    
    addMessage(role, content) {//真的需要这个功能？
        const history = this.histories.find(h => h.id === this.currentHistoryId);
        if (history) {
            history.messages.push({
                role,
                content,
                timestamp: new Date().toISOString()
            });
            this.save();
        }
    },
    
    deleteHistory(historyId) {
        this.histories = this.histories.filter(h => h.id !== historyId);
        if (this.currentHistoryId === historyId) {
            this.createNewHistory();
        }
        this.save();
        this.renderHistoryList();
    },
    
    save() {
        localStorage.setItem('chatHistories', JSON.stringify(this.histories));
        localStorage.setItem('currentHistoryId', this.currentHistoryId);
    },

    renderHistoryList() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        
        this.histories.forEach(history => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `
                <span>${new Date(history.createdAt).toLocaleString()}</span>
                <button class="delete-btn" data-id="${history.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            if (history.id === this.currentHistoryId) {
                item.classList.add('active');
            }
            
            historyList.appendChild(item);
        });
    },
    
    loadCurrentHistory() {
        const history = this.histories.find(h => h.id === this.currentHistoryId);
        if (history) {
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.innerHTML = '';
            history.messages.forEach(msg => {
                updateChat(msg.role, msg.content);
            });
        }
    }
};

const commands = [
    
 
    {label: "润色 Abstract", 
    content: "As an English academic paper writing improvement assistant, your task is to revise the abstract (the text within the single quotation marks) to follow the context–content–conclusion structure. Begin by clearly outlining the research background and identifying the gap in existing studies, emphasizing the necessity and significance of the study. Then, concisely describe the methodology and summarize the key findings. Finally, articulate the main conclusions and highlight their contribution to the field. Ensure the language is precise, concise, logically structured, and academically appropriate, avoiding redundancy or overly complex phrasing. Analyze each sentence line by line. In the result, the first line is the original text, the second line is the edited version, and the third line is the explanation in Chinese. Use the following format:\n* **原文:** xxx\n\n* **润色后:** xxx\n\n* **中文说明:** xxx\n\n. Output strictly according to the format instructions.",
    placeholder: "请输入..."
    },
    {label:"润色 Introduction",
    content:"As an English academic paper writing improvement assistant, your task is to refine the introduction (the text within the single quotation marks) to ensure logical clarity and smooth transitions. Start with a broad overview of the research field, gradually narrowing down to the specific research question, and clearly state how this study addresses the existing gap. Highlight the novelty of the research and conclude with a clear articulation of the study’s objectives. Maintain a rigorous, academically appropriate, and reader-friendly tone, using technical terms where necessary while avoiding overly complex sentences that hinder readability. In the result, the first line is the original text, the second line is the edited version, and the third line is the explanation in Chinese. Use the following format:\n* **原文:** xxx\n\n* **润色后:** xxx\n\n* **中文说明:** xxx\n\n. Output strictly according to the format instructions.",
    placeholder:""

    },
    {
    label: "润色 Method",
    content: "As an English academic paper writing improvement assistant, your task is to enhance the methods section (the text within the single quotation marks) to ensure precision, clarity, and reproducibility. Provide a detailed description of the experimental design, materials, data collection, and analysis methods, ensuring completeness while avoiding unnecessary details. Organize the steps in a logical sequence, using appropriate transitions to maintain coherence. Keep the language concise and academically formal, avoiding excessive technical jargon that might reduce readability and reproducibility. You will return three colums. The first column is the original text, and the second column is the text after eidting, and the third column provides the expannation in Chinese. In addtion, in the edited version, mark the difference using bold font. Output strictly according to the format instructions.", 
    placeholder: "请输入..."
    },
    {label: "润色 Conclusion", 
    content: "As an English academic paper writing improvement assistant, your task is to refine the conclusion (the text within the single quotation marks) to ensure it directly addresses the research objectives, summarizes key findings, and highlights contributions. Avoid merely repeating results; instead, interpret their significance and discuss their implications for the field. Briefly acknowledge the study’s limitations and suggest directions for future research. Maintain clarity, academic rigor, and coherence, ensuring readability and logical flow. Analyze each sentence line by line. In the result, the first line is the original text, the second line is the edited version, and the third line is the explanation in Chinese. Use the following format:\n* **原文:** xxx\n\n* **润色后:** xxx\n\n* **中文说明:** xxx\n\n. Output strictly according to the format instructions.",
    placeholder:"请输入..."
    },
    {
      label: "翻译",
      content: "请自动检测单引号中内容的语言（中文，英文中的一种），并自动翻译成另外一种语言。按照以下格式输出：\n\n检测到的语言： 中文 \n\n**翻译：** \n\n **英文:**  \n",
      placeholder: "请输入要翻译的中文..."
    },
    {
      label: "同义词",
      content: "Provide synonyms or near-synonyms of the content within the single quotation marks.",
      placeholder: "请输入词汇..."
    },
    { 
        label: "润色 指令1", 
        content: "As an English academic paper writing improvement assistant, your task is to improve the text within the single quotation marks according to academic writing standards, ensuring logical coherence and a smooth, natural flow. Optimize paragraph and sentence structure, avoiding overly long or complex sentences, striving for conciseness and clarity to enhance readability. Employ appropriate transition words to improve cohesion. All statements must be precise and academic in tone, avoiding ambiguity, vagueness, or subjective assertions. Remove redundancy and repetitive information; synonyms or near-synonyms may be used as needed. The final text should adhere to the stylistic conventions of academic papers and avoid colloquialisms. In the result, the first line is the original text, the second line is the edited version, and the third line is the explanation in Chinese. Use the following format:\n* **原文:** xxx\n\n* **润色后:** xxx\n\n* **中文说明:** xxx\n\n. Output strictly according to the format instructions.",
        placeholder: "请输入要润色的文本..."
      },
      { 
        label: "润色 指令2", 
        content: "As an English academic paper writing improvement assistant, your task is to improve the spelling, grammer, clarity, conciseness , logical coherence, and the overall readability of the text provided (the text within the single quotation marks), while breaking down long sentences. You will return three colums. The first column is the original text, and the second column is the text after eidting, and the third column provides the expannation in Chinese. In addtion, in the edited version, mark the difference using bold font. Output strictly according to the format instructions.",
        placeholder: "请输入要润色的文本..."
      },
    {
      label: "其他",
      content: "\n请用中文回答单引号内的内容。",
      placeholder: "这里可以随便输入点什么..."
    }
  ];


  let activeButton = null;
  const hint = document.getElementById('hint'); // 直接获取已存在的 hint 元素
  // 创建按钮
  function createCommandButtons(commands) {
    const buttonContainer = document.getElementById('commandButtons');
    
    commands.forEach(command => {
      if (command.label === '--') return;
      
      const button = document.createElement('button');
      button.className = 'command-button';
      button.textContent = command.label;
      button.addEventListener('click', () => {
        // 取消其他按钮的激活状态
        document.querySelectorAll('.command-button').forEach(btn => {
          btn.classList.remove('active');
        });
        
        // 设置当前按钮为激活状态
        button.classList.add('active');
        activeButton = command;
        
        // 更新输入框的 placeholder与hint内筒
        userInput.placeholder = command.placeholder;
        updateHint();
      });
      buttonContainer.appendChild(button);
    });
  }

  function updateHint() {
    if (activeButton) {
      hint.textContent = activeButton.content || ''; // 更新 hint 元素的内容
    } else {
      hint.textContent = ''; // 清空 hint 元素的内容
    }
  } 

// 消息发送和接收
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
sendButton.addEventListener('click', ()=> {// 使用 addEventListener
    const userText = userInput.value.trim();
    if (!activeButton){
        alert('请先选择一个功能按钮！');
        return;
    }
    if (!userText){
        alert('请输入内容！');
        userInput.focus();//设置焦点
        return;//阻止发送
    }
    let symbol = "'"
    const fullCommand = symbol + userText + symbol + activeButton.content;
    sendMessage(userText, fullCommand);

    // 清空输入框但保持按钮状态
    userInput.value = '';
}); 

// 添加回车发送功能
userInput.addEventListener('keydown', (event)=>{
    if (event.key ==='Enter'&&!event.shiftKey){
        event.preventDefault();
        sendButton.click();
    }
});


async function sendMessage(keywords, fullCommand) {
    const userText = keywords.trim();
    updateChat('user', userText);

    // 添加“思考中”的消息
    const tmpMessage = updateChat('ai', '思考中，请等待...');

    const chatToken = document.getElementById('chat_token').value; 
  
            
    const csrftoken = document.querySelector('[name="csrfmiddlewaretoken"]').value; // 正确的querySelector
    try {
        const response = await fetch('chat/', { // 发送到chat视图
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({ message: fullCommand, token: chatToken}),
            credentials: 'same-origin'
        });

        if (!response.ok) {
            //const errorText = await response.text();
            //throw new Error(`HTTP error! status: ${response.status}, text: ${errorText}`);
            const errorData = await response.json(); // 解析错误响应
            const errorMessage = errorData.error || "未知错误"; // 获取错误信息
            tmpMessage.remove();
            updateChat('ai', errorMessage); // 将错误信息显示在聊天框中
            //alert("错误: " + errorMessage); // 弹出警告框显示错误
            return;
        }

        const result = await response.json();
        tmpMessage.remove();
        updateChat('ai', result.response); // 将错误信息显示在聊天框中
        //userInput.value = ''; //清空输入框
    } catch (error) {
        tmpMessage.remove();
        console.error("发送消息时出现错误:", error); //将错误信息输出到浏览器控制台，以便调试
        updateChat('ai', `错误: ${error.message || error}`); // 显示更友好的错误信息
    }
}


//更新消息框
const chatMessages = document.getElementById("chatMessages");
const chatSection = document.getElementById("chatSection");
function updateChat(role, text) {
    const message = document.createElement("div");
    message.classList.add("message", role);
    
    if (role === 'ai') {
      text = text + "\n\n**本站不保存数据，请及时导出！**";//添加提示信息
      const html = marked.parse(text);//转换信息格式
      message.innerHTML = html;//插入信息

      addPlayButtons(message);//添加语音播放按钮
      addExportButton(message, text); // 添加导出按钮
      
    } else {
      message.innerHTML = text;//普通文本
      //const html = marked.parse(text);//转换成markdown格式文本
      //message.innerHTML = html;

      addCopyButton(message, text); // 添加复制按钮
    }

    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;//自动滚到chatMessages的最下面
    return message;//返回message元素
  }

function addExportButton(message, text) {
  const exportButton = createButton("导出", "#28a745", exportFile); // 创建导出按钮
  exportButton.addEventListener("click", () => exportFile(text)); // 绑定事件
  message.appendChild(exportButton);// 添加按钮到消息块中
}

function addCopyButton(message, text) {
  const copyButton = createButton("复制", "#007bff", copyText); // 创建复制按钮
  copyButton.addEventListener("click", () => copyText(text)); // 绑定事件
  message.appendChild(copyButton);// 添加按钮到消息块中
}


function createButton(text, backgroundColor, callback) {
const button = document.createElement("button");
button.textContent = text;
button.style.marginLeft = "10px";
button.style.padding = "5px 10px";
button.style.fontSize = "12px";
button.style.cursor = "pointer";
button.style.backgroundColor = backgroundColor;
button.style.color = "white";
button.style.border = "none";
button.style.borderRadius = "5px";
return button;
}

async function exportFile(text) {
  const defaultName = `AI_Response_${Date.now()}.txt`;// 默认文件名
  if (window.showSaveFilePicker) {
      try {
          // 配置文件选择对话框
          const options = {
              suggestedName: defaultName,
              types: [{ description: "Text Files", accept: { "text/plain": [".txt"] } }],
          };
          // 调用文件选择器
          const handle = await window.showSaveFilePicker(options);
          const writable = await handle.createWritable();
          // 写入内容到文件并关闭
          await writable.write(text);
          await writable.close();
          console.log("文件已成功保存！");
      } catch (error) {
          console.error("用户取消或保存失败：", error);
      }
  } else {
      // 浏览器不支持 showSaveFilePicker，使用 prompt 获取文件名
      const userFileName = prompt("请输入导出文件名（无需扩展名）", defaultName.replace(".txt", ""));
      const fileName = userFileName ? `${userFileName}.txt` : defaultName;
      // 调用 Blob 下载方式
      exportToBlob(fileName, text);
  }
}

function exportToBlob(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  // 模拟点击下载
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  console.log("文件已通过 Blob 保存！");
}

function copyText(text) {
  navigator.clipboard.writeText(text)// 使用navigator.clipboard API复制文本
      .then(() => {
          console.log("文本已复制到剪贴板");
          userInput.value = text; //  点击按钮后文本自动填充到输入框
      })
      .catch(err => {
          console.error("复制到剪贴板失败: ", err);
          //alert("复制到剪贴板失败！");
      });
}


function addPlayButtons(message){
    const germanSentences = message.querySelectorAll('p, li');
    germanSentences.forEach(element => {
        const text = element.textContent.trim(); // trim() 去除多余空格
        if (text.match(/[äöüßÄÖÜ]|[a-zA-Z]/)) { // 简单判断是否包含德语字符
            const playButton = document.createElement('button');
            playButton.className = 'play-button';
            playButton.innerHTML = '<i class="fas fa-volume-up"></i>';
            let utterance = null;

            playButton.addEventListener('click', () => {
                if (speechSynthesis.speaking && !speechSynthesis.paused) {
                    speechSynthesis.cancel();
                    playButton.classList.remove('stop');
                    playButton.innerHTML = '<i class="fas fa-volume-up"></i>';
                } else {
                    utterance = new SpeechSynthesisUtterance(text);
                    utterance.lang = 'de-DE';
                    utterance.onend = () => {
                        playButton.classList.remove('stop');
                        playButton.innerHTML = '<i class="fas fa-volume-up"></i>';
                    };
                    speechSynthesis.speak(utterance);
                    playButton.classList.add('stop');
                    playButton.innerHTML = '<i class="fas fa-stop"></i>';
                }
            });
            //element.appendChild(playButton);暂时不添加语音播放按钮
        }
    });
  }

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    chatHistory.init();
    createCommandButtons(commands)
    // ... 其他初始化代码
}); 


// Scroll to Top button functionality (chatMessages)
document.getElementById("scrollTopButton").addEventListener("click", () => {
    chatMessages.scrollTo({ top: 0, behavior: "smooth" });
  });

// Scroll to Bottom button functionality (chatMessages)
document.getElementById("scrollBottomButton").addEventListener("click", () => {
    chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: "smooth" });
  });


  
/*
// 消息懒加载
const messageLoader = {
    init() {
        this.page = 1;
        this.loading = false;
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this));
        this.observeMessages();
    },
 
    observeMessages() {
        const messages = document.querySelectorAll('.message');
        if (messages.length > 0) {
            this.observer.observe(messages[0]);
        }
    },
    
    async handleIntersection(entries) {
        const entry = entries[0];
        if (entry.isIntersecting && !this.loading) {
            this.loading = true;
            await this.loadMoreMessages();
            this.loading = false;
        }
    },
    
    async loadMoreMessages() {
        try {
            const response = await fetch(`/api/messages/?page=${this.page}`);
            const data = await response.json();
            if (data.messages.length > 0) {
                this.page++;
                this.renderMessages(data.messages);
            }
        } catch (error) {
            console.error('加载消息失败:', error);
        }
    }
};*/
