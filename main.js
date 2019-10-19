//connpass API で現在の参加者数を取得
function fetchParticipants() {
  //イベント毎にスクリプトプロパティにIDを設定する！！
  const EVENT_ID = PropertiesService.getScriptProperties().getProperty("EVENT_ID");

  const CONNPASS_API_ENDPOINT = "https://connpass.com/api/v1/event/";

  var url = CONNPASS_API_ENDPOINT + '?event_id=' + EVENT_ID;
  var options = {
    'method': 'GET'
  };
  
  var api = UrlFetchApp.fetch(url,options),
      response = JSON.parse(api.getContentText());
  return response.events[0].accepted;
}

function fetchParticipantsFluctuation() {
  //1分前の参加者数をキャッシュから取得
  var cache = CacheService.getScriptCache();
  var partricipants_one_minutes_ago = cache.get('participants_one_mitites_ago');

  //今回取得した参加者でキャッシュを上書き
  var participants = fetchParticipants();
  cache.put('participants_one_mitites_ago', participants, 10);
  
  if(partricipants_one_minutes_ago == null) {
    return 0;
  }
  return participants - partricipants_one_minutes_ago
}

function main() {
  fetchParticipants()
}