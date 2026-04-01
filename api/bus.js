export default async function handler(req, res) {
  const { displayCode, stationId: directId } = req.query;
  const API_KEY = "f680f647b113d9fb620069ed709beb822253dd714fcd3c7ec7a73152dbfafed1";
  const BASE = "http://apis.data.go.kr/6410000";

  try {
    let stationId = directId ?? null;

    // ── 1) displayCode로 stationId 조회 ──────────────────────
    if (!stationId && displayCode) {
      // 정류소 번호로 검색
      const searchUrl = `${BASE}/busstationservice/v2/getBusStationListv2?serviceKey=${API_KEY}&keyword=${encodeURIComponent(displayCode)}&format=json`;
      const searchRes = await fetch(searchUrl);
      const searchText = await searchRes.text();

      let searchData;
      try { searchData = JSON.parse(searchText); }
      catch { return res.status(200).json({ _error: "정류소 검색 JSON 파싱 실패", _raw: searchText.slice(0, 500) }); }

      let items = searchData?.response?.msgBody?.busStationList;
      if (!items) {
        return res.status(200).json({ _error: "정류소 검색결과 없음", _raw: searchData });
      }
      if (!Array.isArray(items)) items = [items];

      // mobileNo가 displayCode와 정확히 일치하는 것 우선
      const matched =
        items.find(i => String(i.mobileNo ?? i.mobiStationNo ?? "").trim() === displayCode) ??
        items[0];

      stationId = String(matched.stationId);
    }

    if (!stationId) {
      return res.status(400).json({ _error: "stationId를 찾을 수 없음" });
    }

    // ── 2) 도착 정보 조회 ────────────────────────────────────
    const arrivalUrl = `${BASE}/busarrivalservice/v2/getBusArrivalListv2?serviceKey=${API_KEY}&stationId=${stationId}&format=json`;
    const arrivalRes = await fetch(arrivalUrl);
    const arrivalText = await arrivalRes.text();

    let arrivalData;
    try { arrivalData = JSON.parse(arrivalText); }
    catch { return res.status(200).json({ _resolvedStationId: stationId, _error: "도착정보 JSON 파싱 실패", _raw: arrivalText.slice(0, 500) }); }

    // stationId를 응답에 포함해서 프런트에서 디버그 가능하게
    arrivalData._resolvedStationId = stationId;
    res.status(200).json(arrivalData);

  } catch (error) {
    res.status(500).json({ _error: "서버 오류", detail: error.message });
  }
}
