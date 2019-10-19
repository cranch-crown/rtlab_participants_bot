//connpass API で現在の参加者数を取得
function fetchParticipants(event_id) {
  const CONNPASS_API_ENDPOINT = "https://connpass.com/api/v1/event/";

  var url = CONNPASS_API_ENDPOINT + '?event_id=' + event_id;
  var options = {
    'method': 'GET'
  };
  
  var api = UrlFetchApp.fetch(url,options),
      response = JSON.parse(api.getContentText());
  return response.events[0].accepted;
}

function main() {
  //イベント毎にスクリプトプロパティにIDを設定する！！
  const EVENT_ID = PropertiesService.getScriptProperties().getProperty("EVENT_ID");

  //1分前の参加者数をキャッシュから取得
  var cache = CacheService.getScriptCache();
  var patricipants_one_minutes_ago = cache.get('participants_one_mitites_ago');

  //今回取得した参加者でキャッシュを上書き
  var participants = fetchParticipants(EVENT_ID);
  cache.put('participants_one_mitites_ago', participants, 10);
  
  Logger.log(participants);
  if (participants == patricipants_one_minutes_ago) {
    return 0;
  }
  
  
}