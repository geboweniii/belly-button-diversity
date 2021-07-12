console.log('1. Call function init() to populate the page with intial data results.')
init();

//************************************************************************************** */
//**Function used retrieve initial data for the webpage. This function is called when
//**the webpage and js file are loaded. This will result in pre-populating the
//**drop down menu, demographic table and charts with default information from the
//**samples.json file. */ */
//************************************************************************************** */
function init() {
  console.log('1.1 Function init will now pull data from samples.jason file.')
  d3.json("data/samples.json").then(function (jsonData) {
    let data = jsonData;

    //Capturing the id, which we will call names for the drop-down menu
    let dataNames = data.names;
    var dropDownMenu = d3.select("#selDataset");

    console.log('1.2 Get options and populate drop down menu.')
    dataNames.forEach(function (name) {
      dropDownMenu.append("option").text(name).property("value", name);
    });

    console.log('1.3 Get first option in menu: ' + dataNames[0])
    let selectedID = dataNames[0];

    console.log('2. Call datapull function which will collect data for option : ' + dataNames[0])
    datapull(selectedID);
  });
}

function datapull(selectedID) {
  console.log('2.1 Function datapull will now pull all data from samples.jason file.')
  d3.json("data/samples.json").then(function (jsonData) {
    let data = jsonData;

    console.log('2.2 Now the function will filter through that data for selected ID: ' + selectedID + '.')
    let testSubject = data.samples.filter((val) => val.id == selectedID);
    var testSubjectObj = testSubject[0];

    let otu_ids = testSubjectObj.otu_ids;
    otu_ids = otu_ids.slice(0, 10);
    console.log('2.3 otu_ids for subject ' + selectedID + ': ' + otu_ids);

    let otu_idList = [];
    for (let i = 0; i < otu_ids.length; i++) {
      otu_idList.push(`OTU# ${otu_ids[i]}`);
    }

    let sample_values = testSubjectObj.sample_values;
    sample_values = sample_values.slice(0, 10);
    console.log('sample_values: ' + sample_values);

    let otu_labels = testSubjectObj.otu_labels;
    otu_labels = otu_labels.slice(0, 10);
    //console.log(otu_labels);

    let testSubjectDemos = data.metadata.filter((val) => val.id == selectedID);
    testSubjectDemos = testSubjectDemos[0];
    console.log('testSubjectDemos : ' + testSubjectDemos);

    let wfreq = Object.values(testSubjectDemos)[6];
    console.log('wfreq: ' + wfreq);

    let results = {
      idStr: otu_idList,
      ids: otu_ids,
      values: sample_values,
      labels: otu_labels,
    };

    console.log('1. Call function buildMetaData function using selectedID: ' + selectedID)
    buildMetaData(selectedID);

    console.log('2. Call barChart function and pass results object.')
    barChart(results);

    console.log('3. Call gaugeChart function and pass wfreq: ' + wfreq)
    gaugeChart(wfreq);
    
    console.log('4. Call bubbleChart function and pass results object.')
    bubbleChart(results);
  });
}

//************************************************************************************** */
//**Function used to dynamically build the "Demographic Info" area of the webpage. A
//**selection ID is passed to this function. This function retrieves the data for the
//**selected item from the samples.json dataset. */ */
//Build function to read json file using d3
//************************************************************************************** */
function buildMetaData(sample) {
  console.log('buildMetaData will now retrieve data for ' + sample + ' from the sample.json file.');

  //Use d3 to read json file
  d3.json("data/samples.json").then((data) => {
    var metadata = data.metadata;

    // Filter the data
    var buildingArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = buildingArray[0];

    // Use d3 to select the required panel
    var panelData = d3.select("#sample-metadata");

    // Clear the existing data in the html
    panelData.html("");

    // Use `Object.entries` to add each key and value pair to the panelData
    Object.entries(result).forEach(([key, value]) => {
      panelData.append("h6").text(`${key.toUpperCase()}: ${value}`);
      console.log(key + ': ' + value);
    });
  });
}

//************************************************************************************** */
//**Function used to dynamically build the barchart on the webpage. Results object
//**is passed to this function. The function takes the results passed to it and
//**builds the bar chart */
//Build function to read json file using d3
//************************************************************************************** */
function barChart(results) {
  console.log('barChart function will now build a barchart for the results passed to it.');

  let otu_ids = results.idStr.slice(0, 10);
  let sample_values = results.values.slice(0, 10);
  let otu_labels = results.labels.slice(0, 10);
  let otuNumID = results.ids.slice(0, 10);

  //console.log(sample_values);

  let trace = {
    x: sample_values,
    y: otu_ids,
    mode: "markers",
    orientation: "h",
    type: "bar",
  };

  let plotdata = [trace];

  var layout = {
    title: {text: "Top 10 Bacteria Cultures Found", font:{size:20}},
    margin: { t: 30, l: 150 },
    yaxis: {autorange: "reversed", automargin: true, title: {text: "OTUs",font: {size: 14}}},
    xaxis: {title: {text: "Number Found",font: {size: 14}}}
    };

  let config = {
    responsive: true,
  };

  Plotly.newPlot("bar", plotdata, layout, config);
}

//************************************************************************************** */
//**Function used to dynamically build the gauge chart on the webpage. wfreq
//**is passed to this function. The function takes the wfreq passed to it and
//**builds the gauge chart */
//************************************************************************************** */
function gaugeChart(wfreq) {
  console.log('gaugeChart function will now build a gauge chart for the wfreq passed to it.');
  var data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: wfreq,
      title: { text: "Weekly Washing Frequency" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 9], tickwidth: 1, tickcolor: "#000082" },
        steps: [
          { range: [0, 1], color: "#fff4ed" },
          { range: [1, 2], color: "#ffddc6" },
          { range: [2, 3], color: "#ffc59f" },
          { range: [3, 4], color: "#ffae78" },
          { range: [4, 5], color: "#ff9650" },
          { range: [5, 6], color: "#ff7e29" },
          { range: [6, 7], color: "#ff6702" },
          { range: [7, 8], color: "#ed5f00" },
          { range: [8, 9], color: "#c64800" },
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 490,
        },
      },
    },
  ];

  var layout = { width: 450, height: 338, margin: { t: 0, b: 0 } };
  Plotly.newPlot("gauge", data, layout);
}


//************************************************************************************** */
//**Bubble chart function. This function  creates the bubble chart for the webpage. It
//**requires an input in the form of an object containing results. */ */
//************************************************************************************** */
function bubbleChart(results) {
  let otu_ids = results.ids;
  let sample_values = results.values;
  let otu_labels = results.labels;

  var trace1 = {
    x: otu_ids,
    y: sample_values,
    mode: "markers",
    text: otu_labels,
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: "Earth"
    },
  };

  var data = [trace1];

  var layout = {
    title: "Bacteria Cultures Per Sample",
    hovermode: "closest",
    xaxis: { title: "OTUs" },
    // font: {
    //   family: "Overpass, Open Sans, Raleway",
    // },
    showlegend: false,
    height: 600,
    width: 1200,
  };

  var config = {
    responsive: true,
  };
  Plotly.newPlot("bubble", data, layout, config);
}

//*******************************************//





d3.selectAll("#selDataset").on("change", subjectChanged);

function subjectChanged() {
  let selectedID = d3.select("#selDataset").node().value;

  d3.selectAll("#table").remove();

  datapull(selectedID);
}