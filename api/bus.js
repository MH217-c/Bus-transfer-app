export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { stationId, findByCode } = req.query;
  const API_KEY = "f680f647b113d9fb620069ed709beb822253dd714fcd3c7ec7a73152dbfafed1";
  const GG_KEY  = "b61fc947f6eb4054af2e7519d85ee442";

  // 정류소 관리번호로 stationId 자동 검색
  if (findByCode) {
    try {
      // 수원시(41110) 전체 목록을 페이지별로 검색
      for (let page = 1; page <= 16; page++) {
        const url = `https://openapi.gg.go.kr/BusStation?KEY=${GG_KEY}&Type=json&pIndex=${page}&pSize=100&SIGUN_CD=41110`;
        const response = await fetch(url);
        const data = await response.json();
        const rows = data?.BusStation?.[1]?.row ?? [];
        const match = rows.find(r => r.STATION_MANAGE_NO === findByCode);
        if (match) {
          return res.status(200).json({
            found: true,
            stationId: match.STATION_ID,
            name: match.STATION_NM_INFO,
            code: match.STATION_MANAGE_NO,
          });
        }
      }
      return res.status(200).json({ found: false, code: findByCode });
    } catch(e) {
      return res.status(500).json({ _error: e.message });
    }
  }

  if (!stationId) {
    return res.status(400).json({ _error: "파라미터 필요" });
  }

  const url = `http://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalListv2?serviceKey=${API_KEY}&stationId=${stationId}&format=json`;
  try {
    const response = await fetch(url);
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch(e) {
      return res.status(200).json({ _error: "JSON 파싱 실패", _raw: text.slice(0, 500) });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ _error: "API 호출 실패", detail: error.message });
  }
}
