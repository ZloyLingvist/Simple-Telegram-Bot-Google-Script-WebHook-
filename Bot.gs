/*Подключение */
// https://api.telegram.org/bot<token>/setWebHook?url=<....>/exec

function changes(nameid){
  var tmp=[]
  var b=[]
  var folderID = '"' + nameid + '"';
  var folderSearch = folderID + " " + "in parents";
  
  var search = '(trashed = true or trashed = false) and '+ folderSearch;   
  var files  = DriveApp.searchFiles(search);
  
  while( files.hasNext() ) {
    var file = files.next();
    var fileName = file.getName();
    var fileid  = file.getId();
    var folder = file.getParents().next();
    var owner=file.getOwner();
    tmp.push(fileName,"https://drive.google.com/uc?export=download&id="+fileid)
    b.push(tmp)
    tmp=[]
  } 
  
  return b
}



function doPost(e) {
  var API_TOKEN = '***';//API бота получить у BotFather
  var str="";
  
   function t_post_html_mod(posttext,chid) {
    var payload = {
          'method': 'sendMessage',
          'chat_id': String(chid),
          'text': posttext,
          'parse_mode': 'HTML'
        }
        var data = {
          "method": "post",
          "payload": payload
        }
 
    UrlFetchApp.fetch('https://api.telegram.org/bot' + API_TOKEN + '/', data);
  }
  
  function sendSticker(posttext){
     var payload = {
          'method': 'sendSticker',
          'chat_id': String(chatId),
          'sticker': posttext,
        }
        var data = {
          "method": "post",
          "payload": payload
        }
 
    UrlFetchApp.fetch('https://api.telegram.org/bot' + API_TOKEN + '/', data);
  }
  
   function t_post_video(posttext) {
    var payload = {
          'method': 'sendVideo',
          'chat_id': String(chatId),
          'video': posttext,
        }
        var data = {
          "method": "post",
          "payload": payload
        }
 
    UrlFetchApp.fetch('https://api.telegram.org/bot' + API_TOKEN + '/', data);
  }
  
  function query_inline(posttext,mode){
    if (mode=="3"){
          var ikb={
            'inline_keyboard': [
                [
               {text: "1 1", callback_data: 'pr_1_1'},
               {text: "1 2", callback_data: 'pr_1_2'},   
                ]
            ],
             switch_inline_query: false
         }
          
    }
    
    var payload = {
       'method': 'sendMessage',
       'chat_id': String(chatId),
       'text': posttext,
       "parse_mode": "Markdown",
       'reply_markup': JSON.stringify(ikb)   
    }
     
    var data = {
           "method": "post",
           'contentType': 'application/json',
           'payload' : JSON.stringify(payload)
    }
   
    UrlFetchApp.fetch('https://api.telegram.org/bot' + API_TOKEN + '/', data);
  }
                
  function query_keyb(posttext,mode,chid,mid){
   if (mode=="1"){ 
        var ikb={
            'inline_keyboard': [
                [
                   {text: "***", callback_data: '----'},
                   {text: "***", callback_data: '---'}
                ]
            ],
             switch_inline_query: false
         }
   }
                         
   var payload = {
       'method': 'editMessageText',
       'chat_id': String(chid),
       'message_id': String(mid),
       'text': posttext,
       "parse_mode": "Markdown",
       'reply_markup': JSON.stringify(ikb)     
    }
    
    var data = {
         "method": "post",
          'contentType': 'application/json',
          'payload' : JSON.stringify(payload)
    }
  
    UrlFetchApp.fetch('https://api.telegram.org/bot' + API_TOKEN + '/', data);
 }
  
  /* Ответное текстовое сообщение */
  function t_post_html(posttext) {
    var payload = {
          'method': 'sendMessage',
          'chat_id': String(chatId),
          'text': posttext,
          'parse_mode': 'HTML'
        }
        var data = {
          "method": "post",
          "payload": payload
        }
 
    UrlFetchApp.fetch('https://api.telegram.org/bot' + API_TOKEN + '/', data);
  }
  
  /* Ответное изображение */
   function t_post_photo(posttext) {
    var payload = {
          'method': 'sendPhoto',
          'chat_id': String(chatId),
          'photo': posttext,
        }
        var data = {
          "method": "post",
          "payload": payload
        }
 
    UrlFetchApp.fetch('https://api.telegram.org/bot' + API_TOKEN + '/', data);
  }
  
  /* Ответный документ. В текущей версии pdf или zip */
  function t_post_document(caption,posttext) {
    var payload = {
          'method': 'sendDocument',
          'chat_id': String(chatId),
          'document': String(posttext),
          'caption': String(caption),
        }
        var data = {
          "method": "post",
          "payload": payload
        }
 
    UrlFetchApp.fetch('https://api.telegram.org/bot' + API_TOKEN + '/', data);
  }
  
  function query(posttext,mode){
    /* Inline клавиатура */
    if (mode=="1"){
     var keyboard={ keyboard: [ ["A","B"], ["C","D"],],resize_keyboard:true, one_time_keyboard:true }
    }
    
    var payload = {
          'method': 'sendMessage',
          'chat_id': String(chatId),
          'text': posttext,
          'parse_mode': 'HTML',
          'reply_markup': JSON.stringify(keyboard)
     }
    
    var data = {
         "method": "post",
         "payload": payload
    }
   
    UrlFetchApp.fetch('https://api.telegram.org/bot' + API_TOKEN + '/', data);
  }

  var update = JSON.parse(e.postData.contents);
  
  if (update.hasOwnProperty('message')){
    var msg = update.message;
    var chatId = msg.chat.id;
    
    /* Логирование */
    var dt = Utilities.formatDate(new Date(), "GMT+5", "dd/MM/yyyy HH:mm")
   
    /* Добавляем запись в конец */
    var ss = SpreadsheetApp.openById("10WPFfMhyB5obs0pAu2JS--sBDQ6yo0vGqhoVgvHP1lg");
    var sheet = ss.getSheets()[0]
    var dt = Utilities.formatDate(new Date(), "GMT+5", "dd/MM/yyyy HH:mm")
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1).setValue(dt);
    sheet.getRange(lastRow + 1, 2).setValue(chatId);
  
    var sheet2 = ss.getSheets()[1]
    var e= sheet2.getRange(1,1).getValue()
    sheet2.getRange(1,1).setValue(update.update_id)
    
    /* Загрузка до 20 мб */
    if (msg.hasOwnProperty('document') || msg.hasOwnProperty('photo')){
      if (msg.hasOwnProperty('document')){
          t_post_html('Ого какой файл. Там, что-то важное ? Придется потрудиться, чтобы его осилить')
          var name=msg.document.file_name
          var resp1=UrlFetchApp.fetch('https://api.telegram.org/bot<token>/getFile?file_id='+msg.document.file_id);
          var parsedData2 = JSON.parse(resp1);
          var path=parsedData2.result.file_path
          var url="https://api.telegram.org/file/botbot<token>/"+path
          var response = UrlFetchApp.fetch(url);
          var fileBlob = response.getBlob()
          var destination_id = '****';  
          var destination = DriveApp.getFolderById(destination_id);
          var file=destination.createFile(fileBlob);
          file.setName(name);
          t_post_html('Файл '+name+' получил. Большое Спасибо !')
      }
      
      if (msg.hasOwnProperty('photo')){
          t_post_html('Какое милое фото). Загрузка на 3,2,1..')  
          var resp1=UrlFetchApp.fetch('https://api.telegram.org/bot<token>/getFile?file_id='+msg.photo[3].file_id);
          var parsedData2 = JSON.parse(resp1);
          var path=parsedData2.result.file_path
          var url="https://api.telegram.org/file/bot<token>/"+path
          var response = UrlFetchApp.fetch(url);
          var fileBlob = response.getBlob()
          var destination_id = '****';  
          var destination = DriveApp.getFolderById(destination_id);
          var file=destination.createFile(fileBlob);
          var dt = Utilities.formatDate(new Date(), "GMT+5", "dd/MM/yyyy HH:mm")
          file.setName('photo_'+dt);
          t_post_html('Фото получил. Большое Спасибо!')
      }
    }
      
   
    if (msg.hasOwnProperty('entities') && msg.entities[0].type == 'bot_command') {
	  /* команды бота. Список устанавливаем у BotFather */
      if (msg.text == '/start'){
        /*делаем что-то */
      }
      
      if (msg.text== '/commands'){
           /*делаем что-то */
      }
      
	   /*---------------------*/ 
    }
	
	if (msg.text=="***"){
	  query(msg.text,"1") //вызвали клавиатуру
	}
    
    if (msg.text=="*****"){
       /*В зависимости от того, что ввел пользователь (сам или нажал на inline клавиатуру) выполняем что-либо*/
    }
    
    ////////////////// Запрос новостей ///////////////
    
    if (msg.text=='Забавные истории'){
      var body = DocumentApp.openById('****').getBody().getText();
      var string_arr=body.split("\n")
      var i=Math.floor(Math.random() * 23)
      
      if (string_arr[i]==""){
        i=Math.floor(Math.random() * 23);
        t_post_html(string_arr[i]+'\n')
      } else {
        t_post_html(string_arr[i]+'\n')
      }
    }
       
    if (msg.text=='Фото'){
       arr=changes("****")//отправляем id папки содержимое которой хотим вытащить
       for (var k=0;k< arr.length;k++)
           t_post_photo(arr[k][1])
    }
    
    if (msg.text=='Переводчик'){
      var text='Встроенный google-переводчик слов и совсем коротких фраз \n Формат входных данных:\n translate \n text \n ru en \n (где ru-исходный язык '+
        'и en-язык на который нужно перевести. \n en-английский, ru-русский , uz-узбекский \n '+
        'it-итальянский , kk-казахский , ko-корейский \n la-латинский , fr-французский )'
        t_post_html(text)
    }
    
    if (msg.text.indexOf('translate')+1){
       var tmp=msg.text.split("\n")
       var tmp2=tmp[2].trim().split(" ")
       var string=LanguageApp.translate(tmp[1],tmp2[0],tmp2[1])
       t_post_html(string)
       t_post_html('Готово!')
    }
  }
  
  if (update.hasOwnProperty('callback_query')){
     if (update.callback_query.data=="----"){
       t_post_html_mod('****',update.callback_query.message.chat.id)
       t_post_html_mod('****',update.callback_query.message.chat.id)
     }
  }
}