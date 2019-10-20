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

var message = [
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
    send: false
  },
  {
    apply: function(fluctuation) {
      return fluctuation < 0;
    },
    message: 'キャンセルした人がいます！ﾟ(ﾟ´ω`ﾟ)ﾟ｡',
    send: true
  }
];

function sendMessage(post_message) {
  if(!post_message.send) {
    return 0;
  }

  const ENDPOINT = PropertiesService.getScriptProperties().getProperty("TYPETALK_ENDPOINT");
  const TOKEN = PropertiesService.getScriptProperties().getProperty("TYPETALK_TOKEN");

  var data = {
    'message': post_message.message
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

function watchParticipants() {
  var fluctuation = fetchParticipantsFluctuation();
  var match = message.find(function(rule) {
    return rule.apply(fluctuation);
  });
  sendMessage(match);
}
