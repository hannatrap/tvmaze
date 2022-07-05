"use strict";
const $missingImg = 'http//tinyurl.com/missing-tv';
const $showsList = $("#shows-list");
const $episodesList = $("#episodes-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");



/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`); 

   return res.data.map(result => {
    const show = result.show;
    return{
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : $missingImg,
    };
   });
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
      <div class="media">
        <img src="${show.image}" alt="${show.name}" class="w-25 mr-3">
        <div class="media-body">
          <h5 class="text-primary">${show.name}</h5>
          <div><small>${show.summary}</small></div>
          <button class="btn btn-outline-primary Show-getEpisodes">
            Episodes
          </button>
        </div>
      </div>  
    </div>`);

    $showsList.append($show);  
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

 async function getEpisodes(id) {

  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`
  ); 
   return res.data.map(evt => ({
      id: evt.id,
      name: evt.name,
      season: evt.season,
      number: evt.number,
    }));
  }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }

function populateEpisodes(episodes) {
  $episodesList.empty();

  for (let episode of episodes) {
    const content = $(
        `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `);

    $episodesList.append(content);
  }

  $episodesArea.show();
}



//wait for other code to run and then add the show episode to populate
async function getEpisodesAndDisplay(evt) {
  const showId = $(evt.target).closest(".Show").data("show-id");

  const episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
}

$showsList.on("click", ".Show-getEpisodes", getEpisodesAndDisplay);
