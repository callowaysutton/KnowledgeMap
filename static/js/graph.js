const queryString = window.location.search;

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
    },
    edges: {
        smooth: true,
    },
    physics: {
        barnesHut: {
            "centralGravity": 100
        },
        minVelocity: 1,
        solver: "repulsion",
    repulsion: {
      nodeDistance: 900 // Put more distance between the nodes.
    }
    }
};

network = new vis.Network(container, data, options);

function addNode(source, destination) {
    nodes.add({
        id: destination.hashCode(),
        label: destination,
    });
    edges.add({ from: source.hashCode(), to: destination.hashCode(), title: "Edges work exactly the same." })
}

function addOrigin(concept) {
    nodes.add({
        id: concept.hashCode(),
        label: concept,
    });
}

addOrigin(query);


async function getLeafNode(subject) {
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
                addNode(subject,currentSubject);
            }
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
                addNode(query,currentSubject);
                getLeafNode(currentSubject);
            }
        });
}


getConcepts();