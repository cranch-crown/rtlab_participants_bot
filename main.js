//connpass API で現在の参加者数を取得
function fetchParticipants() {
  //イベント毎にスクリプトプロパティにIDを設定する！！
  const EVENT_ID = PropertiesService.getScriptProperties().getProperty("EVENT_ID");

  const ENDPOINT = PropertiesService.getScriptProperties().getProperty("CONNPASS_ENDPOINT");

  var url = ENDPOINT + '?event_id=' + EVENT_ID;
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
  cache.put('participants_one_mitites_ago', participants, 90);
  
  if(partricipants_one_minutes_ago == null) {
    return null;
  }
  return participants - partricipants_one_minutes_ago;
}

var messages = [
  {
    apply: function(fluctuation) {
      return fluctuation == null;
    },
    message: 'お仕事を始めます！(｀･ω･´)ゞ',
    send: true
  },
  {
    apply: function(fluctuation) {
      return fluctuation > 0;
    },
    message: '参加者が増えました！(*´∀｀*)',
    send: true
  },
  {
    apply: function(fluctuation) {
      return fluctuation == 0;
    },
    message: null,
  },
  {
    apply: function(fluctuation) {
      return fluctuation < 0;
    },
    message: 'キャンセルした人がいます！ﾟ(ﾟ´ω`ﾟ)ﾟ｡',
  }
];

function fetchPostMessage(fluctuation){
  messages.forEach(function(i) {
    if(i.apply(fluctuation)) {
      return i.message;
    }
  });
}

function sendMessage(post_message) {

  if(!post_message) {
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
  Logger.log(response);
}

function watchParticipants() {
  var fluctuation = fetchParticipantsFluctuation();
  var post_message = fetchPostMessage(fluctuation);
  sendMessage(post_message);
}
