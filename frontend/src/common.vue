<script type="text/javascript">
// const httpUrl = "http://mutabackend.natapp1.cc";
const httpUrl = "http://localhost:3000";
const colorMap = [
  "#f5b000",
  "#59ee66",
  "#5a8af9",
  "#dc5af9",
  "#f95a7a",
  "#ff8738",
];
const colorMapUser = {
  "p1": "#f5b000",
  "p2": "#59ee66",
  "p3": "#5a8af9",
  "p4": "#dc5af9",
  "p5": "#f95a7a",
  "p6": "#ff8738",
  "TP1": "#f5b000",
  "TP2": "#59ee66",
};
const greyMap = [
  // "#FFFFFF",
  "#bfbfbf",
  "#b3b3b3",
  "#a6a6a6",
]
const allTasks = [
  "dpm-t1",
  'dpm-t2',
  'wms-t1',
  'wms-t2',
  "HKSM-t1",
  "HKSM-t2",
]
const allParticipants = [
  "p1",
  "p2",
  "p3",
  "p4",
  "p5",
  "p6",
  "TP1",
  "TP2",
]
const interval = 8;
const conditions = {
  c1: function (vc) {
    let alerts = vc.start;
    let gaps = alerts.map((v, i) => {
      if (i === 0) {
        return v;
      } else {
        return v - vc.end[i - 1];
      }
    });
    let alertTimes = [];
    for (let i = 0; i < alerts.length; i++) {
      if (gaps[i] > interval) {
        alertTimes.push(alerts[i] - interval);
      } else {
        alertTimes.push(alerts[i] - gaps[i]);
      }
    }
    return alertTimes;
  },
  c2: function (vc) {
    return vc.start;
  },
}
const resCond = {
  c1: function(index, Heuristic){
    return { content: `Usability problem ${index+1}: ${Heuristic} is going to happen!` };
  },
  c2: function(index, Heuristic){
    return { content: `Usability problem ${index+1}: ${Heuristic} is happening right now!` };
  },
}
export default {
  name: "CommonVar",
  httpUrl,
  colorMap,
  colorMapUser,
  greyMap,
  allTasks,
  allParticipants,
  conditions,
  resCond,
};
</script>