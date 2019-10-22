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
    Logger.log(response);
  return response.events[0].accepted;
}

function fetchParticipantsFluctuation() {
  //1分前の参加者数をキャッシュから取得
  var cache = CacheService.getScriptCache();
  var partricipants_one_minutes_ago = cache.get('participants_one_mitites_ago');

  //今回取得した参加者でキャッシュを上書き
  var current = fetchParticipants();
  cache.put('participants_one_mitites_ago', current, 90);

  Logger.log(current);
  
  if(partricipants_one_minutes_ago == null) {
    return {
      fluctuation : null,
      'current' : current
    };
  }

  return {
    fluctuation : current - partricipants_one_minutes_ago,
    'current' : current
  };
}

var messages = [
  {
    apply: function(fluctuation) {
      return fluctuation == null;
    },
    message: function(current) {
      return Utilities.formatString('お仕事を始めます！(｀･ω･´)ゞ\n現在の参加者登録人数は%.f人です！一緒に参加者を増やしましょう！', current);
    }
  },
  {
    apply: function(fluctuation) {
      return fluctuation > 0;
    },
    message: function(current) {
      return Utilities.formatString('参加者が増えました！(*´∀｀*)\n只今の参加登録人数が%.f人になりました！', current);
    }
  },
  {
    apply: function(fluctuation) {
      return fluctuation == 0;
    },
    message: function(current) {
      return null
    }
  },
  {
    apply: function(fluctuation) {
      return fluctuation < 0;
    },
    message: function(current) {
      return Utilities.formatString('キャンセルした人がいます！ﾟ(ﾟ´ω`ﾟ)ﾟ｡\n参加登録人数が%.f人になってしまいました。。。', current);
    }
  }
];

function fetchPostMessage(participants){
  messages.forEach(function(i) {
    if(i.apply(participants.fluctuation)) {
      return i.message(participants.current);
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

function main() {
  var participants = fetchParticipantsFluctuation();
  var post_message = fetchPostMessage(participants);
  sendMessage(post_message);
}
