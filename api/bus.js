export default async function handler(req, res) {
  const { stationId } = req.query;

  const API_KEY = "f680f647b113d9fb620069ed709beb822253dd714fcd3c7ec7a73152dbfafed1";

  const url = `http://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalListv2?serviceKey=${API_KEY}&stationId=${stationId}`;

  try {
    const response = await fetch(url);
    const data = await response.json(); // ✅ JSON으로 받기

    res.status(200).json(data); // ✅ 그대로 전달

  } catch (error) {
    res.status(500).json({ error: "API 호출 실패" });
  }
}
