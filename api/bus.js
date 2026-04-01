export default async function handler(req, res) {
  const { stationId } = req.query;

  const API_KEY = "f680f647b113d9fb620069ed709beb822253dd714fcd3c7ec7a73152dbfafed1";

  const url = `https://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalListv2?serviceKey=${API_KEY}&stationId=${stationId}`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(text);
  } catch (e) {
    res.status(500).json({ error: "API fetch failed" });
  }
}
