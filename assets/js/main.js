am4core.ready(function() {
  var colorEntities = {
    originalText: "#000",
    work: "#000"
  };

  places = [
    {
      entity: "work",
      title: "[bold]Work[/]\n[font-style:italic]Tabule Magne[/]\n (1325)",
      lat: 48.85661400000001,
      long: 2.3522219000000177,
      from: 1325,
      to: 1325,
      radius: 5
    },
    {
      entity: "originalText",
      title:
        "[bold]Original item[/]\n[font-style:italic]Equation of the sun[/]\n (1564-1655)",
      lat: 45.5016889,
      long: -73.56725599999999,
      from: 1564,
      to: 1655,
      radius: 5
    }
  ];

  if (places.length === 0) {
    $("#alert-info").append(
      "There is no places associated with this item in the database"
    );
  } else if (places.length > 2) {
    // if there is more than two items to display on the map
    for (var place of places) {
      delete place.label;
    }
  }

  am4core.useTheme(am4themes_animated);

  // Create map instance
  var chart = am4core.create("chartdiv", am4maps.MapChart);

  // Set projection and quality definition of the map
  chart.geodata = am4geodata_worldLow;
  chart.projection = new am4maps.projections.Miller();
  chart.deltaLongitude = -10; // move the map a little to the left

  // Create map polygon series containing delineation of the countries
  var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

  // Exclude Antartica
  polygonSeries.exclude = ["AQ"];

  // Make map load data (like country names and polygon shapes) from GeoJSON
  polygonSeries.useGeodata = true;

  // Configure appearance of the background map
  var polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.strokeOpacity = 0.5;
  polygonTemplate.nonScalingStroke = true;
  polygonTemplate.tooltipText = "{name}"; // showing country names on hover
  polygonTemplate.fill = am4core.color("#c8c8c8"); // color of the countries
  // Create hover state and set alternative fill color
  var hs = polygonTemplate.states.create("hover");
  hs.properties.fill = am4core.color("#b4b4b4");

  // create a serie that can contains the data to draw markers on the map
  var imageSeries = chart.series.push(new am4maps.MapImageSeries());

  var openValue = 10000;
  var closingValue = 0;
  var placeMarker = {};
  var placePoint = {};
  var placeText = {};

  for (var place of places) {
    placePoint[place.id] = imageSeries.mapImages.create();
    placePoint[place.id].latitude = place.lat;
    placePoint[place.id].longitude = place.long;

    // define marker appearance
    placeMarker[place.id] = placePoint[place.id].createChild(am4core.Circle);
    placeMarker[place.id].radius = place.radius;
    placeMarker[place.id].fill = am4core.color(colorEntities[place.entity]); // color of the marker
    placeMarker[place.id].stroke = am4core.color("white");
    placeMarker[place.id].nonScaling = true; // the marker stays at the same size when zooming
    placeMarker[place.id].tooltipText = place.title; // text appearing on hover on the marker

    if (place.label) {
      // if there is only two items to display on the map
      // define text appearing on the map
      placeText[place.id] = placePoint[place.id].createChild(am4core.Label);
      placeText[place.id].text = place.label;
      placeText[place.id].fontSize = 17;
      placeText[place.id].fill = am4core.color("black");
      placeText[place.id].verticalCenter = "middle";
      placeText[place.id].paddingLeft = 10;
      placeText[place.id].paddingTop = place.shift;
      placeText[place.id].nonScaling = true;
    }

    if (place.from < openValue) {
      openValue = place.from;
    }

    if (place.to > closingValue) {
      closingValue = place.to;
    }
  }

  // Zoom control
  chart.zoomControl = new am4maps.ZoomControl();

  // Zoom on a country when clicked
  // polygonTemplate.events.on("hit", function(ev) {
  //     ev.target.series.chart.zoomToMapObject(ev.target);
  // });

  //   // Create a scrollbar
  //   var scrollBar = chart.chartContainer.createChild(am4core.Scrollbar);
  //   scrollBar.valign = "bottom";
  //   scrollBar.padding(0, 100, 0, 100);
  // beginning and end of the 2 cursors
  // scrollBar.background.padding(0, 100, 0, 100);
  // beginning and end of the scrollBar itself

  // Date conversion to enter a range from 0 to 1
  //   var startBar = openValue - 50;
  //   var endBar = closingValue + 50;
  //   var timeRange = endBar - startBar;
  //   var yearRange = 1 / timeRange;

  // Create a bow to show the timeframe selected
  //   var timeframe = chart.chartContainer.createChild(am4core.Container);
  //   timeframe.width = 85;
  //   timeframe.height = 35;
  //   timeframe.verticalCenter = "middle";
  //   timeframe.x = am4core.percent(45);
  //   timeframe.y = 440;
  //   timeframe.padding(10, 10, 10, 10);
  //   timeframe.background.fill = am4core.color("#000");
  //   timeframe.background.fillOpacity = 0.1;
  //   var timeframeLabel = timeframe.createChild(am4core.Label);

  //   scrollBar.events.on("rangechanged", function() {
  //     var rangeMin = scrollBar.range.start;
  //     var rangeMax = scrollBar.range.end;

  // Conversion of the min and max range value into date
  // var dateMinRange = parseInt(rangeMin / yearRange + startBar);
  // var dateMaxRange = parseInt(rangeMax / yearRange + startBar);
  // Show the timerange selected
  // scrollBar.startGrip.tooltipText = `${dateMinRange}`;
  // scrollBar.endGrip.tooltipText = `${dateMaxRange}`;
  // timeframeLabel.text = `${dateMinRange}-${dateMaxRange}`;

  // for (var place of places) {
  //   var valueMin = (place.from - startBar) * yearRange;
  //   var valueMax = (place.to - startBar) * yearRange;

  //   if (
  //     (valueMin >= rangeMin && valueMin <= rangeMax) ||
  //     (valueMax >= rangeMin && valueMax <= rangeMax) ||
  //     (rangeMin >= valueMin && rangeMax <= valueMax)
  //   ) {
  // when at least one cursor is in the timeframe
  // or when two cursors are in the timeframe
  //         placeMarker[place.id].fillOpacity = 1;
  //         placeMarker[place.id].strokeWidth = 1;
  //         if (place.label) {
  //           placeText[place.id].fillOpacity = 0.4;
  //         }
  //       } else if (valueMax < rangeMin) {
  //         placeMarker[place.id].fillOpacity = 0.1;
  //         placeMarker[place.id].strokeWidth = 1;
  //         if (place.label) {
  //           placeText[place.id].fillOpacity = 0;
  //         }
  //       } else {
  //         placeMarker[place.id].fillOpacity = 0;
  //         placeMarker[place.id].strokeWidth = 0;
  //         if (place.label) {
  //           placeText[place.id].fillOpacity = 0;
  //         }
  //       }
  //     }
  //   });
});

/*am4core.ready(function() {

            var colorEntities = {
                "originalText" : "#db5c00",
                "work" : "#ffa600",
                "library" : "#ce3b4f",
                "mixed" : "#9d0021"
            };

            places = [{
              "entity":"work",
              "title":"[bold]Work[\/]\n[font-style:italic]Tabule Magne[\/]\n (1325)",
              "lat":48.85661400000001,
              "long":2.3522219000000177,
              "from":1325,
              "to":1325,
              "radius":5
            },{
              "entity":"originalText",
              "title":"[bold]Original item[\/]\n[font-style:italic]Equation of the sun[\/]\n (1564-1655)",
              "lat":45.5016889,
              "long":-73.56725599999999,
              "from":1564,
              "to":1655,
              "radius":5}];

            if (places.length === 0){
                $("#alert-info").append("There is no places associated with this item in the database");
            }


            // Themes begin
            am4core.useTheme(am4themes_animated);

            // Create map instance
            var chart = am4core.create("chartdiv", am4maps.MapChart);

            // Set projection and quality definition of the map
            chart.geodata = am4geodata_worldLow;
            chart.projection = new am4maps.projections.Miller();
            chart.deltaLongitude = -10; // move the map a little to the left

            // Create map polygon series containing delineation of the countries
            var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

            // Exclude Antartica and America
            polygonSeries.exclude = ["AQ"];

            // Make map load data (like country names and polygon shapes) from GeoJSON
            polygonSeries.useGeodata = true;

            // Configure appearance of the background map
            var polygonTemplate = polygonSeries.mapPolygons.template;
            polygonTemplate.strokeOpacity = 0.5;
            polygonTemplate.nonScalingStroke = true;
            polygonTemplate.tooltipText = "{name}"; // showing country names on hover
            polygonTemplate.fill = am4core.color("#c8c8c8"); // color of the countries
            // Create hover state and set alternative fill color
            var hs = polygonTemplate.states.create("hover");
            hs.properties.fill = am4core.color("#b4b4b4");

            // create a serie that can contains the data to draw markers on the map
            var imageSeries = chart.series.push(new am4maps.MapImageSeries());

            var openValue = 10000;
            var closingValue = 0;
            var placeMarker = {};
            var placePoint = {};
            var placeText = {};

            for (var place of places){
                placePoint[place.id] = imageSeries.mapImages.create();
                placePoint[place.id].latitude = place.lat;
                placePoint[place.id].longitude = place.long;

                // define marker appearance
                placeMarker[place.id] = placePoint[place.id].createChild(am4core.Circle);
                placeMarker[place.id].radius = place.radius;
                placeMarker[place.id].fill = am4core.color(colorEntities[place.entity]); // color of the marker
                placeMarker[place.id].stroke = am4core.color("white");
                placeMarker[place.id].strokeWidth = 1;
                placeMarker[place.id].nonScaling = true; // the marker stays at the same size when zooming
                placeMarker[place.id].tooltipText = place.title; // text appearing on hover on the marker
            
                if (place.from < openValue){
                    openValue = place.from;
                }

                if (place.to > closingValue){
                    closingValue = place.to;
                }
            }

            // Zoom control
            chart.zoomControl = new am4maps.ZoomControl();

            // Zoom on a country when clicked
            polygonTemplate.events.on("hit", function(ev) {
                ev.target.series.chart.zoomToMapObject(ev.target);
            });

            // Create a scrollbar
            var scrollBar = chart.chartContainer.createChild(am4core.Scrollbar);
            scrollBar.valign = "bottom";
            scrollBar.padding(0, 100, 0, 100); // beginning and end of the 2 cursors
            scrollBar.background.padding(0, 100, 0, 100); // beginning and end of the scrollBar itself

            // Date conversion to enter a range from 0 to 1
            var startBar = openValue - 50;
            var endBar = closingValue + 50;
            var timeRange = endBar - startBar;
            var yearRange = 1 / timeRange;
  
            scrollBar.events.on("rangechanged", function (e) {
                var rangeMin = scrollBar.range.start;
                var rangeMax = scrollBar.range.end;

                // Conversion of the min and max range value into date
                var dateMinRange = parseInt((rangeMin / yearRange) + startBar);
                var dateMaxRange = parseInt((rangeMax / yearRange) + startBar);

                $("#dates").html(`${dateMinRange}-${dateMaxRange}`);

                for (var place of places){
                    var valueMin = (place.from - startBar) * yearRange;
                    var valueMax = (place.to - startBar) * yearRange;

                    if ((valueMin >= rangeMin && valueMin <= rangeMax) || (valueMax >= rangeMin && valueMax <= rangeMax)) {
                        placeMarker[place.id].fillOpacity = 1;
                    } else if (valueMax < rangeMin){
                        placeMarker[place.id].fillOpacity = 0.2;
                    } else {
                        placeMarker[place.id].fillOpacity = 0;
                    }
                }

            });
        });*/
