const BASE_URL = "https://api.football-data.org/v2/";
const LEAGUE_ID = 2002;
const API_KEY = "9d806601c2d5461d890d88b6178673a7";

const teams_url = `${BASE_URL}competitions/${LEAGUE_ID}/teams`;
const standings_url = `${BASE_URL}competitions/${LEAGUE_ID}/standings?standingType=TOTAL`;

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

// Fungsi untuk mendapatkan data teams dari api.football-data.org
function getTeams(){
   if ("caches" in window){
      caches.match(teams_url).then(response => {
         if (response){
            response.json().then(data => {
               showTeams(data);
            });
         }
      });
   }

   showPreloader();
   fetchApi(teams_url)
      .then(status)
      .then(json)
      .then(data => {
         showTeams(data);
      })
      .catch(error);
}

// Fungsi untuk mendapatkan data standings dari api.football-data.org
function getStandings(){
   if ("caches" in window){
      caches.match(standings_url).then(response => {
         if (response){
            response.json().then(data => {
               showStandings(data);
            });
         }
      });
   }

   showPreloader();
   fetchApi(standings_url)
      .then(status)
      .then(json)
      .then(data => {
         showStandings(data);
      })
      .catch(error);
}

// Fungsi untuk menampilkan tampilan teams
function showTeams(data){
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
                  <a class="waves-effect waves-light btn-small teal" onclick="insertTeamListener(${team.id})"><i class="material-icons left">favorite</i> Add To Favorite</a>
               </div>
            </div>
         </div>
      `;
   });
   document.getElementById("teams").innerHTML = html;
   hidePreloader();
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
               <td class="valign-wrapper"><img class="responsive-img" width="24" height="24" src="${result.team.crestUrl}"> &nbsp; &nbsp; ${result.team.name}</td>
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