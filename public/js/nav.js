document.addEventListener("DOMContentLoaded", function(){
   const elements = document.querySelectorAll(".sidenav");
   M.Sidenav.init(elements);
   loadNavigation();

   // Fungsi untuk menampilkan menu navigasi
   function loadNavigation(){
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(){
         if (this.readyState == 4){
            if (this.status != 200){
               return;
            }

            // Memuat text menu navigasi
            document.querySelectorAll(".topnav, .sidenav").forEach(elm => {
               elm.innerHTML = xhttp.responseText;
            });

            // Memberi event click pada tiap menu navigasi
            document.querySelectorAll(".topnav a, .sidenav a").forEach(elm => {
               elm.addEventListener("click", event => {
                  const sidenav = document.querySelector(".sidenav");
                  M.Sidenav.getInstance(sidenav).close();

                  const page = event.target.getAttribute("href").substr(1);
                  loadPage(page);
               });
            });
         }
      };
      xhttp.open("GET", "nav.html", true);
      xhttp.send();
   }

   let page = window.location.hash.substr(1);
   if (page == ""){
      page = "teams";
   }
   loadPage(page);

   // Fungsi untuk menampilkan halaman konten
   function loadPage(page){
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function (){
         if (this.readyState == 4){
            const content = document.querySelector("#body-content");
            if (this.status == 200){
               content.innerHTML = xhttp.responseText;
               if (page == "teams"){
                  getTeams();
               } else if (page == "standings"){
                  getStandings();
               } else if (page == "favorite_teams"){
                  getFavTeams();
               }
            } else if (this.status == 404){
               content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
            } else {
               content.innerHTML = "<p>Halaman tidak dapat diakese.</p>";
            }
         }
      };
      xhttp.open("GET", "pages/" + page + ".html", true);
      xhttp.send();
   }
});