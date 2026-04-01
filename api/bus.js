async function getArrival(stopId){
  try {
    const res = await fetch(`/api/bus?stationId=${stopId}`);
    const data = await res.json();

    const items = data.response.msgBody.busArrivalList;

    let list = [];

    for (let item of items){
      let route = String(item.routeName);

      if (!FINAL_BUSES.includes(route)) continue;

      if (item.predictTime1){
        list.push({
          route: route,
          time: parseInt(item.predictTime1)
        });
      }
    }

    list.sort((a,b)=>a.time-b.time);
    return list.slice(0,3);

  } catch(e){
    return [];
  }
}
