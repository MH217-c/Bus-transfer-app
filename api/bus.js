export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { stationId } = req.query;
  const API_KEY = "f680f647b113d9fb620069ed709beb822253dd714fcd3c7ec7a73152dbfafed1";

  if (!stationId) {
    return res.status(400).json({ _error: "stationId 파라미터 필요" });
  }

  const url = `http://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalListv2?serviceKey=${API_KEY}&stationId=${stationId}&format=json`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(200).json({ _error: "JSON 파싱 실패", _raw: text.slice(0, 500) });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ _error: "API 호출 실패", detail: error.message });
  }
}
