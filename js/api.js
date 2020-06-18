const BASE_URL = "https://api.football-data.org/v2/";
const LEAGUE_ID = 2002;
const API_KEY = "9d806601c2d5461d890d88b6178673a7";

const ENDPOINT_TEAMS = `${BASE_URL}competitions/${LEAGUE_ID}/teams`;
const ENDPOINT_STANDINGS = `${BASE_URL}competitions/${LEAGUE_ID}/standings?standingType=TOTAL`;

function fetchApi(url){
   return fetch(url, {
      headers: {
         "X-Auth-Token": API_KEY
      }
   });
}

function status(response){
   if (response.status !== 200) {
      console.log("Error : " + response.status);
      return Promise.reject(new Error(response.statusText));
   } else {
      return Promise.resolve(response);
   }
}

function json(response){
   return response.json();
}

function error(error){
   console.log("Error : " + error);
}

// Variabel untuk menampung data teams
let teamData;

// Fungsi untuk mendapatkan data teams dari api.football-data.org
function getTeams(){
   if ("caches" in window){
      caches.match(ENDPOINT_TEAMS).then(response => {
         if (response){
            response.json().then(data => {
               teamData = data;
               showTeams(data);
            });
         }
      });
   }

   showPreloader();
   fetchApi(ENDPOINT_TEAMS)
      .then(status)
      .then(json)
      .then(data => {
         teamData = data;
         showTeams(data);
      })
      .catch(error);
}

// Fungsi untuk menampilkan tampilan teams
function showTeams(data) {
   let html = "";
   data.teams.forEach(team => {
      html += `
         <div class="col s12 m6 l6">
            <div class="card">
               <div class="card-content">
                  <div class="center"><img width="128" height="128" src="${team.crestUrl}"></div>
                  <div class="center flow-text">${team.name}</div>
                  <div class="center">${team.venue}</div>
               </div>
               <div class="card-action right-align">
                  <a class="waves-effect waves-light btn-small teal" onclick="saveFavTeamListener(${team.id})"><i class="material-icons left">favorite</i> Add To Favorite</a>
               </div>
            </div>
         </div>
      `;
   });
   document.getElementById("teams").innerHTML = html;
   hidePreloader();
}

// Fungsi untuk mendapatkan data standings dari api.football-data.org
function getStandings(){
   if ("caches" in window){
      caches.match(ENDPOINT_STANDINGS).then(response => {
         if (response){
            response.json().then(data => {
               showStandings(data);
            });
         }
      });
   }

   showPreloader();
   fetchApi(ENDPOINT_STANDINGS)
      .then(status)
      .then(json)
      .then(data => {
         showStandings(data);
      })
      .catch(error);
}

// Fungsi menampilkan tampilan untuk standings (klasemen sementara)
function showStandings(data){
   let html = "";
   data.standings.forEach(standing => {
      let teamRow = "";
      standing.table.forEach(result => {
         teamRow += `
            <tr>
               <td class="center">${result.position}</td>
               <td class="valign-wrapper"><img class="responsive-img" alt="logo_teams" width="24" height="24" src="${result.team.crestUrl}"> &nbsp; &nbsp; ${result.team.name}</td>
               <td class="center">${result.playedGames}</td>
               <td class="center">${result.won}</td>
               <td class="center">${result.draw}</td>
               <td class="center">${result.lost}</td>
               <td class="center">${result.goalsFor}</td>
               <td class="center">${result.goalsAgainst}</td>
               <td class="center">${result.goalDifference}</td>
               <td class="center">${result.points}</td>
            </tr>
         `;
      });

      html += `
         <div class="col s12 m12">
            <div class="card">
               <div class="card-content">
                  <table class="responsive-table striped">
                  <thead>
                     <tr>
                        <th class="center">Position</th>
                        <th>Team</th>
                        <th class="center">Played</th>
                        <th class="center">Won</th>
                        <th class="center">Draw</th>
                        <th class="center">Lost</th>
                        <th class="center">GF</th>
                        <th class="center">GA</th>
                        <th class="center">GD</th>
                        <th class="center">Points</th>
                     </tr>
                  </thead>
                  <tbody>` + teamRow + `</tbody>
                  </table>
               </div>
            </div>
         </div>
      `;
   });
   document.getElementById("standings").innerHTML = html;
   hidePreloader();
}

// Fungsi untuk mendapatkan data favorite teams dari indexed db
function getFavTeams() {
   showPreloader();
   dbGetAllTeam().then(teams => {
      showFavTeams(teams);
   });
}

// Fungsi untuk menampilkan tampilan favorite teams
function showFavTeams(data) {
   let html = "";
   data.forEach(team => {
      html += `
         <div class="col s12 m6 l6">
            <div class="card">
               <div class="card-content">
                  <div class="center"><img width="128" height="128" src="${team.crestUrl}"></div>
                  <div class="center flow-text">${team.name}</div>
                  <div class="center">${team.venue}</div>
               </div>
               <div class="card-action right-align">
                  <a class="waves-effect waves-light btn-small red" onclick="deleteFavTeamListener(${team.id})"><i class="material-icons left">delete</i> Delete</a>
               </div>
            </div>
         </div>
      `;
   });
   if (data.length == 0) {
      html += `<div class="card-panel teal lighten-2"><h6 class="center-align white-text">No Favorite Team Found!</6></div>`;
   }
   document.getElementById("fav-teams").innerHTML = html;
   hidePreloader();
}

// Fungsi untuk listener onclick pada button save favorite team
function saveFavTeamListener(teamId){
   const team = teamData.teams.filter(data => data.id == teamId)[0];
   dbInsertTeam(team).then(() => {
      M.toast({ html: `${team.name} successfully saved!` });
   });
}

// Fungsi untuk listener onclick pada button delete favorite team
function deleteFavTeamListener(teamId){
   let c = confirm("Delete this team?");
   if (c == true) {
      dbDeleteTeam(teamId).then(() => {
         M.toast({ html: `Team has been deleted!` });
         getFavTeams();
      })
   }
}

// Fungsi untuk menampilkan indikator loading
function showPreloader(){
   const html = `
      <div class="preloader-wrapper big active">
         <div class="spinner-layer spinner-blue">
            <div class="circle-clipper left">
               <div class="circle"></div>
            </div>
            <div class="gap-patch">
               <div class="circle"></div>
            </div>
            <div class="circle-clipper right">
               <div class="circle"></div>
            </div>
         </div>

         <div class="spinner-layer spinner-red">
            <div class="circle-clipper left">
               <div class="circle"></div>
            </div>
            <div class="gap-patch">
               <div class="circle"></div>
            </div>
            <div class="circle-clipper right">
               <div class="circle"></div>
            </div>
         </div>

         <div class="spinner-layer spinner-yellow">
            <div class="circle-clipper left">
               <div class="circle"></div>
            </div>
            <div class="gap-patch">
               <div class="circle"></div>
            </div>
            <div class="circle-clipper right">
               <div class="circle"></div>
            </div>
         </div>

         <div class="spinner-layer spinner-green">
            <div class="circle-clipper left">
               <div class="circle"></div>
            </div>
            <div class="gap-patch">
               <div class="circle"></div>
            </div>
            <div class="circle-clipper right">
               <div class="circle"></div>
            </div>
         </div>
      </div>
   `;
   document.getElementById("preloader").innerHTML = html;
}

// Fungsi untuk menyembunyikan indikator loading
function hidePreloader(){
   document.getElementById("preloader").innerHTML = "";
}