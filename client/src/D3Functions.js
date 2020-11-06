//// creating global variables for dashboard to use in
const SoldSiteColorMap = {
  0: "#7179E6",
  1: "#50D1B5",
  2: "#44ADDC",
  3: "#CD5C5C",
  4: "#EBEFF2",
};
const DonutColorMap = {
  Mobile: "#7179E6",
  Tablet: "#50D1B5",
  Web: "#44ADDC",
  Misc: "#EBEFF2",
};

function LineChart() {
  var ContainerId;
  var width;
  var height;
  var data = [];
  var updateData;
  var line;
  var x_axis;
  //var chart = realTimeLineChart();

  function lc(selection) {
    //var t = setInterval(updateChart, 1000);

    console.log("Bar chart initialized");

    selection.each(function () {
      var svg = d3.select("#chart"),
        margin = {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        },
        width = Math.floor(
          $("#" + ContainerId).width() - margin.left - margin.right
        ),
        height = Math.floor(
          $("#" + ContainerId).height() - margin.top - margin.bottom
        );

      var g = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "globalG");

      g.append("defs")
        .append("clipPath")
        .attr("id", "clip2")
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height);

      // Some static value defined as calculating max Domain from all the items is expensive here so the value can be inserted in
      // Db also for checkup
      let maxDomain = 100;

      var x = d3.scaleLinear().range([0, width]),
        y = d3.scaleLinear().range([height, 0]).domain([0, maxDomain]),
        z = d3.scaleOrdinal(d3.schemeCategory10);

      line = d3
        .line()
        .curve(d3.curveBasis)
        .x(function (d) {
          return x(d.Year);
        })
        .y(function (d) {
          return y(d.Sale);
        });

      z.domain(
        dta.map(function (c) {
          return c.id;
        })
      );

      x_axis = d3.axisBottom().scale(x).tickFormat(d3.format("d")).tickSize(0);
      g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(x_axis);

      var y_axis = d3
        .axisLeft()
        .scale(y)
        .ticks(3)
        .tickValues([
          0,
          Math.floor(maxDomain / 3),
          Math.floor(maxDomain / 1.5),
          maxDomain,
        ])
        .tickSize(-width);
      var y_axis_svg = g.append("g").attr("class", "axis axis--y").call(y_axis);

      svg
        .append("text")
        .attr("x", -(height / 2))
        .attr("y", 20)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Sales Chart")
        .attr("fill", "#A3B3BD");

      // Removing Y-axis from design purpose
      svg.select(".axis--y .domain").remove();

      // horizontal grid lines for design purpose
      svg
        .selectAll(".axis--y .tick line")
        .attr("stroke", "#FAFBFC")
        .attr("stroke-width", "2px");

      svg
        .selectAll(".axis--y .tick text")
        .attr("x", -10)
        .attr("dy", "0.32em")
        .attr("font-family", "tahoma")
        .attr("fill", "#A3B3BD");

      svg
        .selectAll(".axis--x .tick text")
        .attr("y", 8)
        .attr("dy", "0.71em")
        .attr("font-family", "tahoma");

      let pathsG = g
        .append("g")
        .attr("id", "paths")
        .attr("class", "paths")
        .attr("clip-path", "url(#clip2)");

      let duration = 1000; //how quickly to move (will look jerky if less that data input rate)

      updateData = function () {
        dta = data;

        /// all the indexes contains same year Values
        x.domain(
          d3.extent(dta[0].values, function (d) {
            return d.Year;
          })
        );

        x_axis = d3
          .axisBottom()
          .scale(x)
          .tickFormat(d3.format("d"))
          .tickSize(0);
        // Slide x-axis left

        g.select(".axis--x")
          //.attr("transform", "translate(0," + height + ")")
          .call(x_axis);

        svg
          .selectAll(".axis--x .tick text")
          .attr("y", 10)
          .attr("dy", "0.71em")
          .attr("font-family", "tahoma")
          .attr("fill", "#A3B3BD");

        //Join
        var minerG = pathsG.selectAll(".minerLine").data(dta);

        var minerGEnter = minerG
          .enter()
          //Enter
          .append("g")
          .attr("class", "minerLine")
          .merge(minerG);

        //Join
        var minerSVG = minerGEnter.selectAll("path").data(function (d) {
          return [d];
        });
        var minerSVGenter = minerSVG
          .enter()
          //Enter
          .append("path")
          .attr("class", "line")
          .style("stroke", function (d) {
            return SoldSiteColorMap[d.id];
          })
          .style("stroke-width", "2px")
          .merge(minerSVG)
          .merge(minerSVG)
          //Update
          .transition()
          .duration(duration)
          .ease(d3.easeLinear, 2)
          .attr("d", function (d) {
            return line(d.values);
          })
          .attr("transform", null);

        var minerText = d3.select("#legend").selectAll("div").data(dta);

        var minerEnter = minerText
          .enter()
          .append("div")
          .attr("class", "legenditem")
          .style("color", function (d) {
            return SoldSiteColorMap[d.id];
          })
          .merge(minerText)
          .text(function (d) {
            return d.id + ":" + data[d.id];
          });

        svg
          .selectAll("mydots")
          .data(dta)
          .enter()
          .append("circle")
          .attr("cx", function (d, i) {
            return 40 + i * 100;
          })
          .attr("cy", margin.top / 2) // 100 is where the first dot appears. 25 is the distance between dots
          .attr("r", 7)
          .style("fill", function (d) {
            return SoldSiteColorMap[d.id];
          });

        svg
          .selectAll("mylabels")
          .data(dta)
          .enter()
          .append("text")
          .attr("x", function (d, i) {
            return 50 + i * 100;
          })
          .attr("y", margin.top / 2 + 3.5) // 100 is where the first dot appears. 25 is the distance between dots
          .style("fill", function (d) {
            return SoldSiteColorMap[d.id];
          })
          .text(function (d) {
            return d.id;
          })
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")
          .attr("font-size", "10px");

        var mouseG = svg
          .append("g")
          .attr("class", "mouse-over-effects")
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          );

        mouseG
          .append("path") // this is the black vertical line to follow mouse
          .attr("class", "mouse-line")
          .style("stroke", "#A3B3BD")
          .style("stroke-width", "1px")
          .style("opacity", "0");

        var lines = document.getElementsByClassName("line");
        var pathId = document.getElementById("paths");

        var mousePerLine = mouseG
          .selectAll(".mouse-per-line")
          .data(dta)
          .enter()
          .append("g")
          .attr("class", "mouse-per-line");

        mousePerLine
          .append("circle")
          .attr("r", 2)
          .style("stroke", function (d) {
            return SoldSiteColorMap[d.id];
          })
          .style("fill", function (d) {
            return SoldSiteColorMap[d.id];
          })
          .style("stroke-width", "1px")
          .style("opacity", "0");

        mousePerLine.append("text").attr("transform", "translate(10,3)");

        mouseG
          .append("svg:rect") // append a rect to catch mouse movements on canvas
          .attr("width", width) // can't catch mouse events on a g element
          .attr("height", width)
          //.attr('left', getOffset(pathId).left)
          //.attr('top', getOffset(pathId).top)
          .attr("fill", "none")
          .attr("pointer-events", "all")
          .on("mouseout", function () {
            // on mouse out hide line, circles and text
            d3.select(".mouse-line").style("opacity", "0");
            d3.selectAll(".mouse-per-line circle").style("opacity", "0");
            d3.selectAll(".mouse-per-line text").style("opacity", "0");
          })
          .on("mouseover", function () {
            // on mouse in show line, circles and text
            d3.select(".mouse-line").style("opacity", "1");
            d3.selectAll(".mouse-per-line circle").style("opacity", "1");
            d3.selectAll(".mouse-per-line text")
              .style("opacity", "1")
              .style("font-size", "10px")
              .style("color", "#A3B3BD");
          })
          .on("mousemove", function () {
            // mouse moving over canvas
            var mouse = d3.mouse(this);
            d3.select(".mouse-line").attr("d", function () {
              var d = "M" + mouse[0] + "," + height;
              d += " " + mouse[0] + "," + 0;
              return d;
            });

            d3.selectAll(".mouse-per-line").attr("transform", function (d, i) {
              //console.log(width / mouse[0])
              var xDate = x.invert(mouse[0]),
                bisect = d3.bisector(function (d) {
                  return d.date;
                }).right;
              idx = bisect(d.values, xDate);

              var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

              while (true) {
                target = Math.floor((beginning + end) / 2);
                pos = lines[i].getPointAtLength(target);
                if (
                  (target === end || target === beginning) &&
                  pos.x !== mouse[0]
                ) {
                  break;
                }
                if (pos.x > mouse[0]) end = target;
                else if (pos.x < mouse[0]) beginning = target;
                else break; //position found
              }

              d3.select(this).select("text").text(y.invert(pos.y).toFixed(2));

              return "translate(" + mouse[0] + "," + pos.y + ")";
            });
          });
      };
    });
  }

  function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
    };
  }

  lc.ContainerId = function (value) {
    if (!arguments.length) return ContainerId;
    ContainerId = value;
    return lc;
  };

  lc.width = function (value) {
    if (!arguments.length) return width;
    width = value;
    return lc;
  };

  lc.height = function (value) {
    if (!arguments.length) return height;
    height = value;
    return lc;
  };

  lc.x_axis = function (value) {
    if (!arguments.length) return x_axis;
    x_axis = value;
    return lc;
  };

  lc.data = function (value) {
    if (!arguments.length) return data;
    data = value;
    if (typeof updateData === "function") updateData();
    return lc;
  };

  lc.line = function (value) {
    if (!arguments.length) return line;
    line = value;
    return lc;
  };

  return lc;
}

function donutChart() {
  var data = [],
    width,
    height,
    margin = { top: 2, bottom: 10, left: 0, right: 0 },
    variable, // value in data that will dictate proportions on chart
    category, // compare data by
    padAngle, // effectively dictates the gap between slices
    transTime, // transition time
    updateData,
    floatFormat = d3.format(".4r"),
    cornerRadius, // sets how rounded the corners are on each slice
    percentFormat = d3.format(",.2%");

  function chart(selection) {
    selection.each(function () {
      // generate chart
      // ===========================================================================================
      // Set up constructors for making donut. See https://github.com/d3/d3-shape/blob/master/README.md
      var radius = Math.min(width, height - 100) / 2; //// minue height because legends will be addes below donut chart.

      // creates a new pie generator
      var pie = d3
        .pie()
        .value(function (d) {
          return floatFormat(d[variable]);
        })
        .sort(null);

      // contructs and arc generator. This will be used for the donut. The difference between outer and inner
      // radius will dictate the thickness of the donut
      var arc = d3
        .arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.7)
        .cornerRadius(cornerRadius)
        .padAngle(padAngle);

      // this arc is used for aligning the text labels
      var outerArc = d3
        .arc()
        .outerRadius(radius * 0.9)
        .innerRadius(radius * 0.9);
      // ===========================================================================================

      // ===========================================================================================
      // append the svg object to the selection
      // var svg = selection.append('svg')
      var svg = selection
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr(
          "transform",
          "translate(" + width / 2 + "," + (height - 70) / 2 + ")"
        );
      // ===========================================================================================

      // ===========================================================================================
      // g elements to keep elements within svg modular
      svg.append("g").attr("class", "slices");
      svg.append("g").attr("class", "labelname");
      svg.append("g").attr("class", "dots");
      svg.append("g").attr("class", "totalcount");
      svg.append("g").attr("class", "totallabel");
      // ===========================================================================================

      // ===========================================================================================
      // add and colour the donut slices
      var path = svg
        .select(".slices")
        .selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("fill", function (d) {
          return DonutColorMap[d.data[category].trim()];
        })
        .attr("d", arc);
      // ===========================================================================================

      // ===========================================================================================

      // add dots or circles corresponding to the donut chart legends
      var polyline = svg
        .select(".dots")
        .selectAll("circle")
        .data(pie(data))
        .enter()
        .append("circle")
        .attr("cx", -40)
        .attr("cy", function (d, i) {
          return 100 + i * 25;
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function (d) {
          return DonutColorMap[d.data[category].trim()];
        });

      // ===========================================================================================

      // ===========================================================================================

      // add text labels
      var label = svg
        .select(".labelname")
        .selectAll("text")
        .data(pie(data))
        .enter()
        .append("text")
        .text(function (d) {
          return updateLabelText(d);
        })
        .attr("x", -20)
        .attr("y", function (d, i) {
          return 100 + i * 25;
        }) // 100 is where the first dot appears. 25 is the distance between dot
        .style("fill", "#A3B3BD")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-family", "tahoma")
        .style("font-size", "13px");

      var TotalCount = svg
        .select(".totalcount")
        .append("text")
        .html(DataLength) // add text to the circle.
        .attr("dy", 10)
        .style("font-size", "40px")
        .style("font-family", "tahoma")
        .style("text-anchor", "middle");

      var TotalLabel = svg
        .select(".totallabel")
        .append("text")
        .html("Total") // add text to the circle.
        .attr("dy", 35)
        .style("font-size", "15px")
        .style("fill", "#A3B3BD")
        .style("font-weight", "bold")
        .style("font-family", "tahoma")
        .style("text-anchor", "middle");

      svg
        .append("text")
        .attr("x", -(height / 3))
        .attr("y", -120)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "left")
        .style("font-size", "15px")
        .text("Visitors - Today")
        .attr("fill", "#A3B3BD");

      // centres text in tooltip

      // ===========================================================================================

      // ===========================================================================================

      // add tooltip to mouse events on slices and labels
      //d3.selectAll('.labelName text, .slices path').call(toolTip);
      // ===========================================================================================

      // ===========================================================================================
      // FUNCTION TO UPDATE CHART
      updateData = function () {
        var updatePath = d3.select(".slices").selectAll("path");
        var updateCircle = d3.select(".dots").selectAll("circle");
        var updateLabels = d3.select(".labelname").selectAll("text");
        var updateTotalCount = d3.select(".totalcount").selectAll("text");

        var data0 = path.data(), // store the current data before updating to the new
          data1 = pie(data);

        // update data attached to the slices, labels, and polylines. the key function assigns the data to
        // the correct element, rather than in order of how the data appears. This means that if a category
        // already exists in the chart, it will have its data updated rather than removed and re-added.
        updatePath = updatePath.data(data1, key);
        updateCircle = updateCircle.data(data1, key);
        updateLabels = updateLabels.data(data1, key);

        // adds new slices/lines/labels
        updatePath
          .enter()
          .append("path")
          .each(function (d, i) {
            this._current = findNeighborArc(i, data0, data1, key) || d;
          })
          .attr("fill", function (d) {
            return DonutColorMap[d.data[category].trim()];
          })
          .attr("d", arc);

        updateCircle
          .enter()
          .append("circle")
          .each(function (d, i) {
            this._current = findNeighborArc(i, data0, data1, key) || d;
          })
          .attr("cx", -40)
          .attr("cy", function (d, i) {
            return 100 + i * 25;
          }) // 100 is where the first dot appears. 25 is hte distance between dots
          .attr("r", 7)
          .style("fill", function (d) {
            return DonutColorMap[d.data[category].trim()];
          });

        updateLabels
          .enter()
          .append("text")
          .text(function (d) {
            return updateLabelText(d);
          })
          .attr("x", -20)
          .attr("y", function (d, i) {
            return 100 + i * 25;
          }) // 100 is where the first dot appears. 25 is the distance between dots
          .style("fill", "#A3B3BD")
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")
          .style("font-family", "tahoma")
          .style("font-size", "13px");

        updateTotalCount
          .enter()
          .append("text")
          .html(DataLength) // add text to the circle.
          .attr("dy", 10)
          .style("font-size", "40px")
          .style("font-family", "tahoma")
          .style("text-anchor", "middle");

        // removes slices/labels/lines that are not in the current dataset
        updatePath
          .exit()
          .transition()
          .duration(transTime)
          .attrTween("d", arcTween)
          .remove();

        updateCircle
          .exit()
          .transition()
          .duration(transTime)
          .attrTween("points", pointTween)
          .remove();

        updateLabels.exit().remove();

        updateTotalCount.exit().remove();

        // animates the transition from old angle to new angle for slices/lines/labels
        updatePath.transition().duration(transTime).attrTween("d", arcTween);

        updateCircle
          .transition()
          .duration(transTime)
          .attrTween("points", pointTween);

        updateLabels.transition().duration(transTime);

        updateLabels.text(updateLabelText); // update the label text

        updateTotalCount.text(DataLength); // update the total count

        // add tooltip to mouse events on slices and labels
        //d3.selectAll('.labelName text, .slices path').call(toolTip);
      };
      // ===========================================================================================
      // Functions
      // calculates the angle for the middle of a slice
      function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
      }

      // function to create the HTML string for the tool tip. Loops through each key in data object
      // and returns the html string key: value
      function toolTipHTML() {
        return "100";
      }

      // calculate the points for the polyline to pass through
      function calculatePoints(d) {
        // see label transform function for explanations of these three lines.
        var pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos];
      }

      function labelTransform(d) {
        // effectively computes the centre of the slice.
        // see https://github.com/d3/d3-shape/blob/master/README.md#arc_centroid
        var pos = outerArc.centroid(d);

        // changes the point to be on left or right depending on where label is.
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return "translate(" + pos + ")";
      }

      function updateLabelText(d) {
        return d.data[category] + ": " + d.data[variable] + "";
      }

      // function that calculates transition path for label and also it's text anchoring
      function labelStyleTween(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
          var d2 = interpolate(t);
          return midAngle(d2) < Math.PI ? "start" : "end";
        };
      }

      function labelTween(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
          var d2 = interpolate(t),
            pos = outerArc.centroid(d2); // computes the midpoint [x,y] of the centre line that would be
          // generated by the given arguments. It is defined as startangle + endangle/2 and innerR + outerR/2
          pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1); // aligns the labels on the sides
          return "translate(" + pos + ")";
        };
      }

      function pointTween(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
          var d2 = interpolate(t),
            pos = outerArc.centroid(d2);
          pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          return [arc.centroid(d2), outerArc.centroid(d2), pos];
        };
      }

      // function to calculate the tween for an arc's transition.
      // see http://bl.ocks.org/mbostock/5100636 for a thorough explanation.
      function arcTween(d) {
        var i = d3.interpolate(this._current, d);
        this._current = i(0);
        return function (t) {
          return arc(i(t));
        };
      }

      function findNeighborArc(i, data0, data1, key) {
        var d;
        return (d = findPreceding(i, data0, data1, key))
          ? { startAngle: d.endAngle, endAngle: d.endAngle }
          : (d = findFollowing(i, data0, data1, key))
          ? { startAngle: d.startAngle, endAngle: d.startAngle }
          : null;
      }
      // Find the element in data0 that joins the highest preceding element in data1.
      function findPreceding(i, data0, data1, key) {
        var m = data0.length;
        while (--i >= 0) {
          var k = key(data1[i]);
          for (var j = 0; j < m; ++j) {
            if (key(data0[j]) === k) return data0[j];
          }
        }
      }

      function key(d) {
        return d.data[category];
      }

      // Find the element in data0 that joins the lowest following element in data1.
      function findFollowing(i, data0, data1, key) {
        var n = data1.length,
          m = data0.length;
        while (++i < n) {
          var k = key(data1[i]);
          for (var j = 0; j < m; ++j) {
            if (key(data0[j]) === k) return data0[j];
          }
        }
      }

      // ===========================================================================================
    });
  }

  // getter and setter functions. See Mike Bostocks post "Towards Reusable Charts" for a tutorial on how this works.
  chart.width = function (value) {
    if (!arguments.length) return width;
    width = value;
    return chart;
  };

  chart.height = function (value) {
    if (!arguments.length) return height;
    height = value;
    return chart;
  };

  chart.margin = function (value) {
    if (!arguments.length) return margin;
    margin = value;
    return chart;
  };

  chart.radius = function (value) {
    if (!arguments.length) return radius;
    radius = value;
    return chart;
  };

  chart.padAngle = function (value) {
    if (!arguments.length) return padAngle;
    padAngle = value;
    return chart;
  };

  chart.cornerRadius = function (value) {
    if (!arguments.length) return cornerRadius;
    cornerRadius = value;
    return chart;
  };

  chart.variable = function (value) {
    if (!arguments.length) return variable;
    variable = value;
    return chart;
  };

  chart.category = function (value) {
    if (!arguments.length) return category;
    category = value;
    return chart;
  };

  chart.transTime = function (value) {
    if (!arguments.length) return transTime;
    transTime = value;
    return chart;
  };

  chart.data = function (value) {
    if (!arguments.length) return data;
    data = value;
    if (typeof updateData === "function") updateData();
    return chart;
  };
  return chart;
}

function BarChart() {
  var data = [],
    margin = { top: 20, right: 30, bottom: 30, left: 40 },
    width,
    height,
    variable, // value in data that will dictate proportions on chart
    category, // compare data by
    transTime, // transition time
    updateData,
    barheight,
    x = d3.scaleBand(),
    y = d3.scaleLinear(),
    xAxisCall = d3.axisBottom(),
    yAxisCall = d3.axisLeft(),
    svg,
    tooltip = d3.select("body").append("div").attr("class", "toolTip"),
    defaultBarColor;

  function barchart(selection) {
    console.log("Bar char initialized");

    selection.each(function () {
      // set the ranges
      (width = width - margin.left - margin.right),
        (height = height - margin.top - margin.bottom);

      // append the svg object to the body of the page
      // append a 'group' element to 'svg'
      // moves the 'group' element to the top left margin
      svg = d3.select("#chart");
      svg = svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Scale the range of the data in the domains
      x.range([0, width])
        .padding(0.4)
        .domain(
          data.map(function (d) {
            return d[category];
          })
        );
      y.range([height, 0]).domain([
        0,
        d3.max(data, function (d) {
          return parseInt(d[variable]) + 10;
        }),
      ]);

      xAxisCall.scale(x);
      yAxisCall.scale(y);

      var t = d3.transition().duration(transTime);

      // add the x Axis
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x" + variable)
        .call(xAxisCall);

      // add the y Axis
      svg
        .append("g")
        .attr("class", "y" + variable)
        .call(yAxisCall);

      // append the rectangles for the bar chart
      svg
        .selectAll(".bar")
        .data(data, function (d) {
          return d[variable];
        })
        .enter()
        .append("rect")
        .attr("class", variable)
        .transition(t)
        .attr("height", function (d) {
          return height - y(d[variable]);
        })
        //.attr("width", function (d) { return width - x(d.enrols); })
        .attr("x", function (d) {
          return x(d[category]);
        })
        .attr("y", function (d) {
          return y(d[variable]);
        })
        .attr("width", x.bandwidth())
        .attr("fill", function (d, i) {
          return SoldSiteColorMap[i];
        });

      svg
        .selectAll(".legends text")
        .data(data, function (d) {
          return d[variable];
        })
        .enter()
        .append("text")
        .text(function (d) {
          return d[variable];
        })
        .attr("x", function (d) {
          return x(d[category]) + 5;
        })
        .attr("y", function (d) {
          return y(d[variable]) - 10;
        })
        .attr("class", "legends")
        .transition(t)
        //.style("fill", "#A3B3BD")
        .attr("fill", function (d, i) {
          return SoldSiteColorMap[i];
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-family", "tahoma")
        .style("font-size", "13px");

      svg
        .append("text")
        .attr("x", -(height / 2))
        .attr("y", -20)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Sales Count")
        .attr("fill", "#A3B3BD");

      // removing y axis
      svg.select(".y" + variable + " .domain").remove();

      //horizontal grid lines for design purpose
      svg
        .selectAll(".y" + variable + " .tick line")
        .attr("stroke", "#FAFBFC")
        .attr("stroke-width", "2px");

      svg
        .selectAll(".y" + variable + " .tick text")
        .attr("x", -10)
        .attr("dy", "0.32em")
        .attr("font-family", "tahoma")
        .attr("fill", "#A3B3BD");

      svg
        .selectAll(".x" + variable + " .tick text")
        .attr("y", 8)
        .attr("dy", "0.71em")
        .attr("font-family", "tahoma")
        .attr("fill", "#A3B3BD");

      //d3.selectAll('.' + variable + "").call(toolTip);

      updateData = function () {
        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        //var svg = selection.append("svg")
        //	.attr("width", width + margin.left + margin.right)
        //	.attr("height", height + margin.top + margin.bottom)
        //	.append("g")
        //	.attr("transform",
        //		"translate(" + margin.left + "," + margin.top + ")");

        if (data.length > 0) {
          console.log("Bar char updated");

          var maxDomain = d3.max(data, function (d) {
            return parseInt(d[variable]) + 10;
          });

          x.range([0, width])
            .padding(0.4)
            .domain(
              data.map(function (d) {
                return d[category];
              })
            );
          y.range([height, 0]).domain([0, maxDomain]);

          xAxisCall.scale(x).tickSize(0);
          yAxisCall
            .scale(y)
            .ticks(3)
            .tickValues([
              0,
              Math.floor(maxDomain / 3),
              Math.floor(maxDomain / 1.5),
              maxDomain,
            ])
            .tickSize(-width);

          var t = d3.transition().duration(transTime);

          svg
            .select(".x" + variable)
            //.attr("transform", "translate(0," + height + ")")
            .call(xAxisCall);

          svg
            .select(".y" + variable)
            .transition(t)
            .call(yAxisCall);

          // removing y axis
          svg.select(".y" + variable + " .domain").remove();

          // horizontal grid lines for design purpose
          svg
            .selectAll(".y" + variable + " .tick line")
            .attr("stroke", "#FAFBFC")
            .attr("stroke-width", "2px");

          svg
            .selectAll(".y" + variable + " .tick text")
            .attr("x", -10)
            .attr("dy", "0.32em")
            .attr("font-family", "tahoma")
            .attr("fill", "#A3B3BD");

          svg
            .selectAll(".x" + variable + " .tick text")
            .attr("y", 8)
            .attr("dy", "0.71em")
            .attr("font-family", "tahoma")
            .attr("fill", "#A3B3BD");

          svg.selectAll("." + variable).remove();
          svg.selectAll(".legends").remove();

          // append the rectangles for the bar chart
          svg
            .selectAll(".bar")
            .data(data, function (d) {
              return d[variable];
            })
            .enter()
            .append("rect")
            .attr("class", variable)
            //.transition(t)
            .attr("height", function (d) {
              return height - y(d[variable]);
            })
            //.attr("width", function (d) { return width - x(d.enrols); })
            .attr("x", function (d) {
              return x(d[category]);
            })
            .attr("y", function (d) {
              return y(d[variable]);
            })
            .attr("width", x.bandwidth())
            .attr("fill", function (d, i) {
              return SoldSiteColorMap[i];
            });

          svg
            .selectAll(".legends text")
            .data(data, function (d) {
              return d[variable];
            })
            .enter()
            .append("text")
            .text(function (d) {
              return d[variable];
            })
            .attr("x", function (d) {
              return x(d[category]) + 5;
            })
            .attr("y", function (d) {
              return y(d[variable]) - 10;
            })
            .attr("class", "legends")
            .transition(t)
            //.style("fill", "#A3B3BD")
            .attr("fill", function (d, i) {
              return SoldSiteColorMap[i];
            })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .style("font-family", "tahoma")
            .style("font-size", "13px");

          //bar
          //	.transition(t)
          //	.attr("class", variable)
          //	.attr("width", function (d) { return x(d[variable]); })
          //	.attr("y", function (d) { return y(d[category]); });

          //d3.selectAll('.' + variable + "").call(toolTip);
        }
      };

      function toolTip(selection) {
        selection
          .on("mouseenter", function (d) {
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .style("background-color", "black") // colour based on category mouse is over
              .style("fill-opacity", 0.35)
              .html(d[category] + "<br>" + "" + d[variable]);
          })
          .on("mouseout", function (d) {
            tooltip.style("display", "none");
          });
      }
    });
  }

  barchart.width = function (value) {
    if (!arguments.length) return width;
    width = value;
    return barchart;
  };

  barchart.height = function (value) {
    if (!arguments.length) return height;
    height = value;
    return barchart;
  };

  barchart.margin = function (value) {
    if (!arguments.length) return margin;
    margin = value;
    return barchart;
  };

  barchart.variable = function (value) {
    if (!arguments.length) return variable;
    variable = value;
    return barchart;
  };

  barchart.category = function (value) {
    if (!arguments.length) return category;
    category = value;
    return barchart;
  };

  barchart.transTime = function (value) {
    if (!arguments.length) return transTime;
    transTime = value;
    return barchart;
  };

  barchart.data = function (value) {
    if (!arguments.length) return data;
    data = value;
    if (typeof updateData === "function") updateData();
    return barchart;
  };

  barchart.barheight = function (value) {
    if (!arguments.length) return barheight;
    barheight = value;
    return barchart;
  };

  barchart.x = function (value) {
    if (!arguments.length) return x;
    x = value;
    return barchart;
  };

  barchart.y = function (value) {
    if (!arguments.length) return y;
    y = value;
    return barchart;
  };

  barchart.xAxisCall = function (value) {
    if (!arguments.length) return xAxisCall;
    xAxisCall = value;
    return barchart;
  };

  barchart.yAxisCall = function (value) {
    if (!arguments.length) return yAxisCall;
    yAxisCall = value;
    return barchart;
  };

  barchart.svg = function (value) {
    if (!arguments.length) return svg;
    svg = value;
    return barchart;
  };

  barchart.tooltip = function (value) {
    if (!arguments.length) return tooltip;
    tooltip = value;
    return barchart;
  };

  barchart.defaultBarColor = function (value) {
    if (!arguments.length) return defaultBarColor;
    defaultBarColor = value;
    return barchart;
  };

  return barchart;
}

global.Line = null;
global.donut = null;
global.Bar = null;
function InitializeLineChart(ContainerId) {
  Line = new LineChart()
    .ContainerId(ContainerId)
    .width($("#" + ContainerId).width())
    .height($("#" + ContainerId).height())
    .data(dta);

  d3.select("#" + ContainerId).call(Line);
}

function InitializeBarChart(ContainerId) {
  Bar = new BarChart()
    .width($("#" + ContainerId).width())
    .height($("#" + ContainerId).height())
    .transTime(750) // length of transitions in ms
    .variable("value")
    .category("label")
    .barheight("10")
    .defaultBarColor("red");

  d3.select("#" + ContainerId).call(Bar);
}

function InitializeDonuChart(ContainerId) {
  donut = donutChart()
    .width($("#" + ContainerId).width())
    .height(270)
    .transTime(750) // length of transitions in ms
    .cornerRadius(3) // sets how rounded the corners are on each slice
    .padAngle(0.02) // effectively dictates the gap between slices
    .variable("value")
    .category("label");

  d3.select("#" + ContainerId).call(donut);
}
