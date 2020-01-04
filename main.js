var messages = [
  {
    apply: function (fluctuation) {
      return fluctuation == null;
    },
    message: function (current) {
      return Utilities.formatString('お仕事を始めます！(｀･ω･´)ゞ\n現在の参加者登録人数は%i人です！一緒に参加者を増やしましょう！', current);
    }
  },
  {
    apply: function (fluctuation) {
      return fluctuation > 0;
    },
    message: function (current) {
      return Utilities.formatString('参加者が増えました！(*´∀｀*)\n只今の参加登録人数が%i人になりました！', current);
    }
  },
  {
    apply: function (fluctuation) {
      return fluctuation == 0;
    },
    message: function (current) {
      return null
    }
  },
  {
    apply: function (fluctuation) {
      return fluctuation < 0;
    },
    message: function (current) {
      return Utilities.formatString('キャンセルした人がいます！ﾟ(ﾟ´ω`ﾟ)ﾟ｡\n参加登録人数が%i人になってしまいました。。。', current);
    }
  }
];

function fetchPostMessage(participants) {
  for(var i=0; i < 4; i++) {
    if(messages[i].apply(participants.fluctuation)){
      return messages[i].message(participants.current);
    }
  }
}

//1分ごとに参加者の変動を確認するメソッド、
function main() {
  var api = new ConnPass();
  var participants = api.fetchParticipants();
  var post_message = fetchPostMessage(participants);
  sendMessage(post_message);
}

//週次報告
function weeklyReport() {
  var cache = CacheService.getScriptCache();
  var current = cache.get('participants');
  var post_message = Utilities.formatString('【週次報告】\n\n参加人数 %i人 です！', current);
  sendMessage(post_message);
}