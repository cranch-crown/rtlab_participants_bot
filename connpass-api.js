//connpass API で現在の参加者数を取得
function fetchParticipants() {
    //イベント毎にスクリプトプロパティにIDを設定する！！
    const EVENT_ID = PropertiesService.getScriptProperties().getProperty("EVENT_ID");

    const ENDPOINT = PropertiesService.getScriptProperties().getProperty("CONNPASS_ENDPOINT");

    var url = ENDPOINT + '?event_id=' + EVENT_ID;
    var options = {
        'method': 'GET'
    };

    var api = UrlFetchApp.fetch(url, options),
        response = JSON.parse(api.getContentText());
    return response.events[0].accepted;
}

function sendMessage(post_message) {

    if (!post_message) {
      return 0;
    }
  
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