export default async function handler(req, res) {
  const { keyword } = req.query;
  const API_KEY = "f680f647b113d9fb620069ed709beb822253dd714fcd3c7ec7a73152dbfafed1";

  const url = `http://apis.data.go.kr/6410000/busstationservice/v2/getBusStationListv2?serviceKey=${API_KEY}&keyword=${encodeURIComponent(keyword)}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "정류소 검색 실패" });
  }
}
