//引数：Typetalkに表示させるメッセージ
//戻り値：使わない
function sendMessage(post_message) {

    if (!post_message) return;
  
    const ENDPOINT = PropertiesService.getScriptProperties().getProperty("TYPETALK_ENDPOINT");
    const TOKEN = PropertiesService.getScriptProperties().getProperty("TYPETALK_TOKEN");
  
    var data = {
      'message': post_message
    };
    var headers = {
      'X-TYPETALK-TOKEN': TOKEN
    }
    var options = {
      'method': 'post',
      'payload': data,
      'headers': headers
    }
    var response = UrlFetchApp.fetch(ENDPOINT, options);
}