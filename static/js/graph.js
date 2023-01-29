const queryString = window.location.search;

function startTimer () {
    setTimeout(stopTimer,5000);
}

function stopTimer () {
    return;
}

String.prototype.hashCode = function () {
    var hash = 0,
        i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

// You can supply an element as your title.
var titleElement = document.createElement("div");
titleElement.style.border = "1px solid gray";
titleElement.style.height = "10em";
titleElement.style.width = "10em";

// With arbitrary DOM structure underneath.
var titleElementInner = document.createElement("div");
titleElementInner.style.height = "1em";
titleElementInner.style.width = "1em";
titleElementInner.style.background = "red";
titleElementInner.style.transition = "all 1s ease-in-out";
titleElement.appendChild(titleElementInner);

// Even dynamic behavior is possible.
setInterval(function () {
    titleElementInner.style.marginTop = Math.random() * 9 + "em";
    titleElementInner.style.marginLeft = Math.random() * 9 + "em";
}, 2000);

const urlParams = new URLSearchParams(queryString);
const query = urlParams.get('search')

var nodes = new vis.DataSet([]);
var edges = new vis.DataSet([]);
var container = document.getElementById("mynetwork");
var data = {
    nodes: nodes,
    edges: edges,
};
var options = {
    nodes: {
        shape: "dot",
        size: 72,
        font: "18px verdana white",
    },
    edges: {
        smooth: true,
    },
    physics: {
        barnesHut: {
            "centralGravity": 100
        },
        minVelocity: 10,
        solver: "repulsion",
        repulsion: {
            nodeDistance: 900 // Put more distance between the nodes.
        }
    }
};

network = new vis.Network(container, data, options);

function addNode(source, destination) {
    startTimer();
    try {
        if (destination) {
        nodes.add({
            id: destination.hashCode(),
            label: destination,
        });
    }
    } catch {
        console.log("Can't add nodes!");
    }

    try {
        edges.add({ from: source.hashCode(), to: destination.hashCode(), title: "Edges work exactly the same." })
    } catch {
        console.log("Couldn't add edge!")
    }
}

function addOrigin(concept) {
    nodes.add({
        id: concept.hashCode(),
        label: concept,
    });
}

addOrigin(query);
var count = 0;

function getLeafNode(subject) {
    if (count > 10) {
        return;
    }
    return fetch('/api/graph',
        {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: `{"prompt":"${subject}"}`
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            tempData = data;
            choices = tempData;

            text = choices.choices.at(0).text
            str = text.split("\n")
            for (var i = 2; i < str.length; i++) {
                currentSubject = text.split("\n")[i].split(". ")[1];
                addNode(subject, currentSubject);
                getLeafNode(currentSubject);
            }
            count += 1;
        });
}


var choices;
function getConcepts() {
    return fetch('/api/graph',
        {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: `{"prompt":"${query}"}`
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            tempData = data;
            choices = tempData;

            text = choices.choices.at(0).text
            str = text.split("\n")
            for (var i = 2; i < str.length; i++) {
                currentSubject = text.split("\n")[i].split(". ")[1];
                addNode(query, currentSubject);
                getLeafNode(currentSubject);
            }
        });
}


getConcepts();


panel = document.getElementsByClassName("js-cd-panel-main")[0];
skeleton = document.getElementById("skeleton-loading");
panel.addEventListener('click', function (event) {
    if (hasClass(event.target, 'js-cd-close') || hasClass(event.target, "js-cd-panel-main")) {
        event.preventDefault();
        removeClass(panel, 'cd-panel--is-visible');
        removeClass(skeleton, 'invisible');
        document.getElementById("panel-content").textContent = ""
    }
});

network.on('click', function (properties) {
    var ids = properties.nodes;
    var clickedNodes = nodes.get(ids);
    console.log('clicked nodes:', clickedNodes);
    document.getElementById("panel-title").textContent=clickedNodes[0].label;
    addClass(panel, 'cd-panel--is-visible');

    const options = {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: `{"prompt":"${clickedNodes[0].label}"}`
      };
      
      fetch('/api/summary', options)
        .then(response => response.json())
        .then(response => {
            addClass(skeleton, 'invisible');
            document.getElementById("panel-content").textContent = response.choices.at(0).text
        })
        .catch(err => console.error(err));
});

function hasClass(el, className) {
    if (el.classList) return el.classList.contains(className);
    else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}
function addClass(el, className) {
   if (el.classList) el.classList.add(className);
   else if (!hasClass(el, className)) el.className += " " + className;
}
function removeClass(el, className) {
    if (el.classList) el.classList.remove(className);
    else if (hasClass(el, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
      el.className=el.className.replace(reg, ' ');
    }
}

network.on( "zoom", function(properties){
    var options = {
        nodes: {
            // 1/scale to make text larger as scale is smaller
            // 16 is my default font size
            font: {
                size: 32,
                color: "white"
                
            }              
        }
    };
    network.setOptions(options);
});