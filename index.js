// Your Assignment2 JavaScript code goes here
const url = 'http://ec2-54-172-96-100.compute-1.amazonaws.com/feed/random?q=noodle';
let allTweets = [];
let tempFilter = [];
let tempSorted = [];
let idSet = new Set();
let dateComparator = (a, b) => new Date(b.created_at) - new Date(a.created_at);
// eslint-disable-next-line no-unused-vars
function imgError(image) {
    image.onerror = '';
    image.src = 'img/no_photo.png';
    return true;
}
function fetchAndRefresh() {
    console.log("calling");
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((myJson) => {
            refreshTweets(myJson.statuses);
        })
        .catch(err => {
            // error catching
            console.log(err);
        });
}

let searchString = "";

const handleSearch = event => {
    searchString = event.target.value.trim().toLowerCase();
    tempFilter = allTweets.filter(tweet => tweet.text.toLowerCase().includes(searchString));
    const sortedResult = tempFilter.sort(dateComparator);
    while (tweetContainer.firstChild) {
        tweetContainer.removeChild(tweetContainer.firstChild);
    }
    tweetList = document.createElement('ul');
    tweetContainer.appendChild(tweetList);
    sortedResult.forEach(htmlGen);
}
document.getElementById("searchBar").addEventListener("input", handleSearch);

let tweetList = null;
const tweetContainer = document.getElementById('tweet-container');

/**
 * Adds distinct tweets to allTweets, creates html for those tweets
 *
 * @param {Array<Object>} tweets - A list of new tweets
 * @returns None, the tweets will be renewed
 */
function refreshTweets(tweets) {
    // feel free to use a more complicated heuristics like in-place-patch, for simplicity, we will clear all tweets and append all tweets back
    // {@link https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript}
    while (tweetContainer.firstChild) {
        tweetContainer.removeChild(tweetContainer.firstChild);
    }
    
    // create an unordered list to hold the tweets
    // {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement}
    tweetList = document.createElement('ul');
    // append the tweetList to the tweetContainer
    // {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild}
    tweetContainer.appendChild(tweetList);
    // all tweet objects (no duplicates) stored in tweets variable
    for(let i = 0; i < tweets.length; i++){
        console.log(tweets[i]);
        if(!idSet.has(tweets[i])){
            allTweets.push(tweets[i]);
            idSet.add(tweets[i].id);
        }
    }

    // filter on search text
    // {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter}
    const filteredResult = allTweets.filter(tweet => tweet.text.toLowerCase().includes(searchString));
    // sort by date
    // {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort}
    const sortedResult = filteredResult.sort(dateComparator);

    // execute the arrow function for each tweet
    // {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach}
    sortedResult.forEach(htmlGen);
}

/**
 * Returns the sum of a and b
 * @param {JSON} tweetObject - a JSON representing a tweet
 */
function htmlGen(tweetObject){
    // create a container for individual tweet
    const tweet = document.createElement('li');
    // e.g. create a div holding tweet content
    const tweetContent = document.createElement('div');
    tweetContent.setAttribute('class', 'tweet');

    //profile picture
    const tweetPPWrapper = document.createElement('div');
    const tweetPP = document.createElement('img');

    // console.log(tweetObject.user.profile_image_url_https);
    tweetPP.setAttribute('class', 'profilePicture');
    tweetPP.setAttribute('src', tweetObject.user.profile_image_url_https);
    tweetPP.setAttribute('onerror', 'imgError(this)');
    tweetPPWrapper.appendChild(tweetPP);
    tweetContent.appendChild(tweetPPWrapper);

    //text of tweet
    const tweetInfo = document.createElement('div');
    tweetInfo.setAttribute('class', 'tweetInfo');

    const userInfo = document.createElement('div');
    userInfo.setAttribute('class', 'userInfo');

    const userNameWrapper = document.createElement('div');
    const boldUNW = document.createElement('b');
    userNameWrapper.setAttribute('class', 'userNameWrapper');
    const userName = document.createTextNode(tweetObject.user.name);
    boldUNW.appendChild(userName);
    userNameWrapper.appendChild(boldUNW);

    const userAtWrapper = document.createElement('div');
    userAtWrapper.setAttribute('class', 'userAtWrapper');
    const userAt = document.createTextNode('@' + tweetObject.user.screen_name);
    userAtWrapper.appendChild(userAt);

    const tweetDateWrapper = document.createElement('div');
    tweetDateWrapper.setAttribute('class', 'tweetDate');
    const mom = moment(tweetObject.created_at).format('LLL');
    // const tweetDate = document.createTextNode(mom);
    // const mom = moment(tweetObject.created_at.substring(0, 10)).format('LLL');
    const tweetDate = document.createTextNode(mom);
    tweetDateWrapper.appendChild(tweetDate);


    userInfo.appendChild(userNameWrapper);
    userInfo.appendChild(userAtWrapper);
    userInfo.appendChild(tweetDateWrapper);
    tweetInfo.appendChild(userInfo);


    const tweetTextWrapper = document.createElement('div');
    tweetTextWrapper.setAttribute('class', 'tweetTextWrapper');
    const tweetText = document.createTextNode(tweetObject.text);
    // append the text node to the div
    tweetTextWrapper.appendChild(tweetText);
    tweetInfo.appendChild(tweetTextWrapper);
    tweetContent.appendChild(tweetInfo);
    // you may want to put more stuff here like time, username...
    tweet.appendChild(tweetContent);

    // finally append your tweet into the tweet list
    tweetList.appendChild(tweet);
}

let intervalID = window.setInterval(fetchAndRefresh, 5000);

/**
 * Determines when the collection should be paused or not
 * @param checkbox - an HTML checkbox
 */
function handleChange(checkbox) {
    // console.log("checked", checkbox.checked);
    if (checkbox.checked == true) {
        console.log("stopped");
        window.clearInterval(intervalID);
    } else {
        console.log("started");
        intervalID = window.setInterval(fetchAndRefresh, 5000);
    }
}