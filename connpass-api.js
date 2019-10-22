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