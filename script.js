/* =====================================
   S.A.G.E
   SCRIPT PRINCIPAL
   VERSION 1.0
===================================== */



// ==============================
// RECUPERATION DES ELEMENTS
// ==============================


const loginTab = document.getElementById("loginTab");

const registerTab = document.getElementById("registerTab");


const loginForm = document.getElementById("loginForm");

const registerForm = document.getElementById("registerForm");



const loginButton = document.getElementById("loginButton");

const registerButton = document.getElementById("registerButton");





const homeSection = document.getElementById("homeSection");

const productsSection = document.getElementById("productsSection");

const teamSection = document.getElementById("teamSection");

const accountSection = document.getElementById("accountSection");







// ==============================
// CHANGEMENT CONNEXION / INSCRIPTION
// ==============================



if(loginTab){

loginTab.addEventListener("click", function(){


loginForm.classList.remove("hidden");

registerForm.classList.add("hidden");


loginTab.classList.add("tab-active");

registerTab.classList.remove("tab-active");


});


}







if(registerTab){

registerTab.addEventListener("click", function(){


registerForm.classList.remove("hidden");

loginForm.classList.add("hidden");


registerTab.classList.add("tab-active");

loginTab.classList.remove("tab-active");


});


}









// ==============================
// CONNEXION UTILISATEUR
// ==============================



if(loginButton){

loginButton.addEventListener("click", function(){

    let phone = document.getElementById("loginPhone").value.trim();
    let password = document.getElementById("loginPassword").value;

    if(phone === "" || password === ""){
        alert("Veuillez remplir tous les champs");
        return;
    }

    // === ACCÈS ADMIN SECRET ===
    if(phone === "917274512" && password === "m*9X#2vL!8zQ$5wP1@K"){
        ouvrirAdmin();
        return;
    }

    // === CONNEXION NORMALE ===
    let comptes = JSON.parse(localStorage.getItem("tousLesComptes") || "{}");

    if(!comptes[phone]){
        alert("Ce numéro n'a pas de compte. Veuillez vous inscrire.");
        return;
    }

    if(comptes[phone].password !== password){
        alert("Code PIN incorrect");
        return;
    }

    localStorage.setItem("utilisateurActuel", phone);
    localStorage.setItem("nomUtilisateur", comptes[phone].nom);
    localStorage.setItem("telephoneUtilisateur", phone);
    localStorage.setItem("codeInvitation", comptes[phone].codeInvitation);
    localStorage.setItem("soldeRecharge", comptes[phone].soldeRecharge);
    localStorage.setItem("soldeRetrait", comptes[phone].soldeRetrait);

    soldeRetrait = Number(comptes[phone].soldeRetrait) || 0;
    if (typeof afficherSoldeRetrait === "function") {
        afficherSoldeRetrait();
    }

    localStorage.setItem("mesFilleuls", JSON.stringify(comptes[phone].mesFilleuls || []));
    localStorage.setItem("produitsAchetes", JSON.stringify(comptes[phone].produitsAchetes || []));

    ouvrirAccueil();
    chargerCompte();
    afficherSoldeRetrait();

});

}












// ==============================
// INSCRIPTION UTILISATEUR
// ==============================


if(registerButton){

registerButton.addEventListener("click", function(){

    let name = document.getElementById("firstName").value.trim();
    let phone = document.getElementById("registerPhone").value.trim();
    let password = document.getElementById("registerPassword").value;
    let confirm = document.getElementById("confirmPassword").value;
    let inviteCode = document.getElementById("inviteCode").value.trim().toUpperCase();

    if(name === "" || phone === "" || password === ""){
        alert("Veuillez remplir tous les champs");
        return;
    }

    if(password !== confirm){
        alert("Les codes PIN ne correspondent pas");
        return;
    }

    // Générer le code d'invitation unique
    const monCode = genererCodeInvitation(phone);

    // Créer le compte utilisateur
    let comptes = JSON.parse(localStorage.getItem("tousLesComptes") || "{}");

    comptes[phone] = {
        nom: name,
        telephone: phone,
        password: password,
        codeInvitation: monCode,
        codeParrain: inviteCode || null,
        soldeRecharge: 0,
        soldeRetrait: 10000,
        mesFilleuls: [],
        produitsAchetes: [],
        dateInscription: new Date().toLocaleString()
    };

    
    
    
    // Si il a un parrain, l'ajouter dans la chaîne (niveau 1, 2 et 3)
if (inviteCode !== "") {
    let codeActuel = inviteCode;
    let niveauActuel = 1;

    while (codeActuel && niveauActuel <= 3) {
        let trouve = false;

        for (let num in comptes) {
            if (comptes[num].codeInvitation === codeActuel) {
                if (!comptes[num].mesFilleuls) comptes[num].mesFilleuls = [];

                // Éviter les doublons
                let dejaPresent = comptes[num].mesFilleuls.some(function(f) {
                    return f.telephone === phone;
                });

                if (!dejaPresent) {
                    comptes[num].mesFilleuls.push({
                        nom: name,
                        telephone: phone,
                        niveau: niveauActuel,
                        statut: "inactif",
                        commission: 0,
                        dateInscription: new Date().toLocaleString()
                    });
                }

                // Passer au niveau supérieur
                codeActuel = comptes[num].codeParrain || null;
                niveauActuel++;
                trouve = true;
                break;
            }
        }

        if (!trouve) break;
    }
}




    localStorage.setItem("tousLesComptes", JSON.stringify(comptes));

    // Connecter cet utilisateur
    localStorage.setItem("utilisateurActuel", phone);
    localStorage.setItem("codeInvitation", monCode);
    localStorage.setItem("nomUtilisateur", name);
    localStorage.setItem("telephoneUtilisateur", phone);
    localStorage.setItem("soldeRecharge", "0");
    localStorage.setItem("soldeRetrait", "10000");
    localStorage.setItem("mesFilleuls", JSON.stringify(comptes[phone].mesFilleuls));

    alert("Compte créé avec succès !\nTon code d'invitation : " + monCode);
   
    ouvrirAccueil();

});

}










// ==============================
// OUVERTURE ACCUEIL
// ==============================



function ouvrirAccueil(){



document.querySelector(".auth-section").classList.add("hidden");


homeSection.classList.remove("hidden");



}

// =====================================
// NAVIGATION ENTRE LES ESPACES
// =====================================



const navHome = document.getElementById("navHome");

const navProducts = document.getElementById("navProducts");

const navTeam = document.getElementById("navTeam");

const navAccount = document.getElementById("navAccount");






function cacherToutesLesPages(){


if(homeSection){

homeSection.classList.add("hidden");

}


if(productsSection){

productsSection.classList.add("hidden");

}


if(teamSection){

teamSection.classList.add("hidden");

}


if(accountSection){

accountSection.classList.add("hidden");

}


}









function afficherPage(page){



cacherToutesLesPages();


page.classList.remove("hidden");



}









// PAGE ACCUEIL


if(navHome){


navHome.addEventListener("click", function(){


afficherPage(homeSection);



});



}








// PAGE PRODUITS


if(navProducts){


navProducts.addEventListener("click", function(){


afficherPage(productsSection);



});



}








// PAGE EQUIPE


if(navTeam){


navTeam.addEventListener("click", function(){


afficherPage(teamSection);



});



}








// PAGE COMPTE


if(navAccount){


navAccount.addEventListener("click", function(){


afficherPage(accountSection);



});



}










// =====================================
// FENETRES RECHARGE ET RETRAIT
// =====================================



const rechargeButton = document.getElementById("rechargeButton");


const withdrawButton = document.getElementById("withdrawButton");

const bonusButton = document.getElementById("bonusButton");

const withdrawBalance = document.getElementById("withdrawBalance");

let soldeRetrait = Number(localStorage.getItem("soldeRetrait")) || 0;

function afficherSoldeRetrait() {

    if (withdrawBalance) {
        withdrawBalance.innerText = soldeRetrait.toLocaleString() + " F";
    }

    localStorage.setItem("soldeRetrait", soldeRetrait);

}

afficherSoldeRetrait();


const rechargeWindow = document.getElementById("rechargeWindow");


const withdrawWindow = document.getElementById("withdrawWindow");









if(rechargeButton){


rechargeButton.addEventListener("click", function(){


rechargeWindow.classList.remove("hidden");


});


}








if(withdrawButton){


withdrawButton.addEventListener("click", function(){


withdrawWindow.classList.remove("hidden");


});


}










// FERMETURE DES POPUPS EN CLIQUANT A L'EXTERIEUR



if(rechargeWindow){


rechargeWindow.addEventListener("click", function(e){


if(e.target === rechargeWindow){


rechargeWindow.classList.add("hidden");


}


});


}








if(withdrawWindow){


withdrawWindow.addEventListener("click", function(e){


if(e.target === withdrawWindow){


withdrawWindow.classList.add("hidden");


}


});


}










// =====================================
// IMAGE PRODUIT AUTOMATIQUE
// =====================================



const sliderImage = document.getElementById("sliderImage");



let imagesProduits = [

"images/aspirateur.png",

"images/scie-disque.png",

"images/perceuse.png",

"images/pulverisateur.png",

"images/tronçonneuse.png",

"images/tracteur.png",

"images/debroussailleuse.png"

];



let imageActuelle = 0;







function changerImage(){



if(sliderImage){



imageActuelle++;



if(imageActuelle >= imagesProduits.length){


imageActuelle = 0;


}



sliderImage.src = imagesProduits[imageActuelle];



}



}







setInterval(changerImage,5000);

// =====================================
// BIENVENUE UTILISATEUR
// =====================================


const closeWelcome = document.getElementById("closeWelcome");


if(closeWelcome){


closeWelcome.addEventListener("click", function(){


const welcomeBox = document.querySelector(".welcome-box");


if(welcomeBox){


welcomeBox.style.display = "none";


}



});


}







// =====================================
// SYSTÈME D'ÉQUIPE ET PARRAINAGE
// =====================================

function genererCodeInvitation(telephone) {
    const base = telephone ? telephone.slice(-4) : Math.floor(Math.random() * 9000 + 1000);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return "SAGE" + base + random;
}

function getFilleuls() {
    return JSON.parse(localStorage.getItem("mesFilleuls") || "[]");
}

function calculerStatsEquipe() {
    const filleuls = getFilleuls();
    let count1 = 0, count2 = 0, count3 = 0;
    let actifs = 0;
    let totalComm = 0;
    let level1Comm = 0, level2Comm = 0, level3Comm = 0;

    filleuls.forEach(f => {
        if (f.niveau === 1) count1++;
        if (f.niveau === 2) count2++;
        if (f.niveau === 3) count3++;
        if (f.statut === "actif") actifs++;
        if (f.commission) {
            totalComm += f.commission;
            if (f.niveau === 1) level1Comm += f.commission;
            if (f.niveau === 2) level2Comm += f.commission;
            if (f.niveau === 3) level3Comm += f.commission;
        }
    });

    localStorage.setItem("teamSize", actifs);
    localStorage.setItem("totalCommission", totalComm);
    localStorage.setItem("level1Commission", level1Comm);
    localStorage.setItem("level2Commission", level2Comm);
    localStorage.setItem("level3Commission", level3Comm);
    localStorage.setItem("countLevel1", count1);
    localStorage.setItem("countLevel2", count2);
    localStorage.setItem("countLevel3", count3);
}

function chargerEquipe() {
    calculerStatsEquipe();

    let phoneActuel = localStorage.getItem("utilisateurActuel") || "";
let comptes = JSON.parse(localStorage.getItem("tousLesComptes") || "{}");
const code = (comptes[phoneActuel] && comptes[phoneActuel].codeInvitation) 
    ? comptes[phoneActuel].codeInvitation 
    : (localStorage.getItem("codeInvitation") || "SAGE0000");
    
    
    const teamSize = Number(localStorage.getItem("teamSize")) || 0;
    const totalComm = Number(localStorage.getItem("totalCommission")) || 0;
    const level1 = Number(localStorage.getItem("level1Commission")) || 0;
    const level2 = Number(localStorage.getItem("level2Commission")) || 0;
    const level3 = Number(localStorage.getItem("level3Commission")) || 0;
    const count1 = Number(localStorage.getItem("countLevel1")) || 0;
    const count2 = Number(localStorage.getItem("countLevel2")) || 0;
    const count3 = Number(localStorage.getItem("countLevel3")) || 0;

    const myCodeEl = document.getElementById("myCode");
    const inviteLinkEl = document.getElementById("inviteLink");
    const teamSizeEl = document.getElementById("teamSize");
    const totalCommEl = document.getElementById("totalCommission");
    const level1El = document.getElementById("level1Amount");
    const level2El = document.getElementById("level2Amount");
    const level3El = document.getElementById("level3Amount");
    const count1El = document.getElementById("countLevel1");
    const count2El = document.getElementById("countLevel2");
    const count3El = document.getElementById("countLevel3");

    if (myCodeEl) myCodeEl.value = code;
    if (inviteLinkEl) inviteLinkEl.value = "https://sage-app.com/?code=" + code;
    if (teamSizeEl) teamSizeEl.innerText = teamSize;
    if (totalCommEl) totalCommEl.innerText = totalComm.toLocaleString() + " F";
    if (level1El) level1El.innerText = level1.toLocaleString() + " F";
    if (level2El) level2El.innerText = level2.toLocaleString() + " F";
    if (level3El) level3El.innerText = level3.toLocaleString() + " F";
    if (count1El) count1El.innerText = count1;
    if (count2El) count2El.innerText = count2;
    if (count3El) count3El.innerText = count3;

    afficherFilleulsParNiveau(1);
}



function afficherFilleulsParNiveau(niveau) {
    const list = document.getElementById("teamMembersList");
    const filleuls = getFilleuls().filter(f => f.niveau === niveau);

    if (filleuls.length === 0) {
        list.innerHTML = '<p class="empty-team">Aucun membre à ce niveau</p>';
        return;
    }

    let html = '<table class="filleuls-table"><thead><tr><th>Nom</th><th>Statut</th></tr></thead><tbody>';

    filleuls.forEach(function(f) {
        let statutClass = f.statut === "actif" ? "status-actif" : "status-inactif";
        let statutText = f.statut === "actif" ? "Actif" : "Inactif";

        html += '<tr><td>' + f.nom + '</td><td><span class="' + statutClass + '">' + statutText + '</span></td></tr>';
    });

    html += '</tbody></table>';
    list.innerHTML = html;
}





// Copier le lien
const copyLinkBtn = document.getElementById("copyLinkBtn");
if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", function () {
        const link = document.getElementById("inviteLink").value;
        navigator.clipboard.writeText(link).then(() => {
            alert("Lien copié !");
        }).catch(() => {
            alert("Lien : " + link);
        });
    });
}

// Copier le code
const copyCodeBtn = document.getElementById("copyCodeBtn");
if (copyCodeBtn) {
    copyCodeBtn.addEventListener("click", function () {
        const code = document.getElementById("myCode").value;
        navigator.clipboard.writeText(code).then(() => {
            alert("Code copié : " + code);
        }).catch(() => {
            alert("Code : " + code);
        });
    });
}

// Bouton Partager
const shareButton = document.getElementById("shareButton");
if (shareButton) {
    shareButton.addEventListener("click", function () {
        const code = document.getElementById("myCode").value;
        const link = document.getElementById("inviteLink").value;
        const text = "Rejoins-moi sur S.A.G.E ! Utilise mon code : " + code + "\n" + link;

        if (navigator.share) {
            navigator.share({
                title: "S.A.G.E - Smart Advanced Growth Economy",
                text: text
            });
        } else {
            navigator.clipboard.writeText(text).then(() => {
                alert("Lien et code copiés !");
            }).catch(() => {
                alert(text);
            });
        }
    });
}

// Onglets des niveaux
const levelTabs = document.querySelectorAll(".level-tab");
levelTabs.forEach(tab => {
    tab.addEventListener("click", function () {
        levelTabs.forEach(t => t.classList.remove("active"));
        this.classList.add("active");
        const level = Number(this.dataset.level);
        afficherFilleulsParNiveau(level);
    });
});

// Charger l'équipe
if (navTeam) {
    navTeam.addEventListener("click", function () {
        chargerEquipe();
    });
}








// =====================================
// SAUVEGARDE SIMPLE DES INFORMATIONS
// =====================================



function sauvegarderUtilisateur(){
    let nom = document.getElementById("firstName");
    let telephone = document.getElementById("registerPhone");

    if(nom && telephone){
        localStorage.setItem("nomUtilisateur", nom.value);
        localStorage.setItem("telephoneUtilisateur", telephone.value);

        if (!localStorage.getItem("codeInvitation")) {
            const code = genererCodeInvitation(telephone.value);
            localStorage.setItem("codeInvitation", code);
        }

        if (!localStorage.getItem("teamSize")) {
            localStorage.setItem("teamSize", "0");
            localStorage.setItem("totalCommission", "0");
            localStorage.setItem("level1Commission", "0");
            localStorage.setItem("level2Commission", "0");
            localStorage.setItem("level3Commission", "0");
            localStorage.setItem("countLevel1", "0");
            localStorage.setItem("countLevel2", "0");
            localStorage.setItem("countLevel3", "0");
            localStorage.setItem("mesFilleuls", "[]");
        }
    }
}










// =====================================
// AFFICHAGE INFORMATIONS COMPTE
// =====================================


function chargerCompte(){

    let nomSauvegarde = localStorage.getItem("nomUtilisateur");
    let telephoneSauvegarde = localStorage.getItem("telephoneUtilisateur");
    let phoneActuel = localStorage.getItem("utilisateurActuel") || "";
let comptes = JSON.parse(localStorage.getItem("tousLesComptes") || "{}");
let codeSauvegarde = (comptes[phoneActuel] && comptes[phoneActuel].codeInvitation) 
    ? comptes[phoneActuel].codeInvitation 
    : (localStorage.getItem("codeInvitation") || "SAGE0000");
    
    

    const profileName = document.getElementById("profileName");
    const profilePhone = document.getElementById("profilePhone");
    const profileCode = document.getElementById("profileCode");

    if(profileName && nomSauvegarde){
        profileName.innerText = nomSauvegarde;
    }

    if(profilePhone && telephoneSauvegarde){
        profilePhone.innerText = "+237 " + telephoneSauvegarde;
    }

    if(profileCode){
        profileCode.innerText = codeSauvegarde;
    }

}





chargerCompte();





// =====================================
// LISTE DES PRODUITS S.A.G.E
// =====================================

const produitsSAGE = [

{
nom: "Aspirateur",
image: "images/aspirateur.png",
prix: 5000,
gainJour: 500,
duree: 20,
gainTotal: 10000
},


{
    nom: "scie-disque",
    image: "images/scie-disque.png",
    prix: 9000,
    gainJour: 900,
    duree: 20,
    gainTotal: 18000
},


{
nom: "Perceuse",
image: "images/perceuse.png",
prix: 15000,
gainJour: 1500,
duree: 20,
gainTotal: 30000
},


{
nom: "Pulverisateur",
image: "images/pulverisateur.png",
prix: 26750,
gainJour: 3210,
duree: 20,
gainTotal: 64200
},


{
nom: "Tronçonneuse",
image: "images/tronçonneuse.png",
prix: 50000,
gainJour: 7500,
duree: 20,
gainTotal: 150000
},


{
nom: "Tracteur",
image: "images/tracteur.png",
prix: 80000,
gainJour: 16000,
duree: 20,
gainTotal: 320000
},


{
nom: "Débroussailleuse",
image: "images/debroussailleuse.png",
prix: 100000,
gainJour: 35000,
duree: 20,
gainTotal: 700000
}

];


// =====================================
// BOUTONS PRODUITS
// =====================================

const boutonsAcheter = document.querySelectorAll(".buy-button");

boutonsAcheter.forEach((bouton) => {

    bouton.addEventListener("click", () => {

        const idProduit = bouton.dataset.product;

        const produit = produitsSAGE.find(p => {
            return (
                p.nom.toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[\s-]+/g, "")
                ===
                idProduit.replace(/-/g, "")
            );
        });

        if (!produit) {
            alert("Produit introuvable.");
            return;
        }

        let soldeRecharge = Number(localStorage.getItem("soldeRecharge")) || 0;

        if (soldeRecharge < produit.prix) {
            alert("Solde de recharge insuffisant.\nIl te faut " + produit.prix.toLocaleString() + " F.");
            return;
        }

        const confirmation = confirm(
            "Confirmer l'achat de : " + produit.nom +
            "\n\nPrix : " + produit.prix.toLocaleString() + " F" +
            "\nRevenu quotidien : " + produit.gainJour.toLocaleString() + " F"
        );

        if (!confirmation) return;

        // Déduire le solde
        soldeRecharge -= produit.prix;
        localStorage.setItem("soldeRecharge", soldeRecharge);

        // Enregistrer le produit acheté
        const produitsAchetes = getProduitsAchetes();
        produitsAchetes.push({
            id: idProduit,
            nom: produit.nom,
            image: produit.image,
            prix: produit.prix,
            gainJour: produit.gainJour,
            duree: produit.duree,
            gainTotal: produit.gainTotal,
            dateAchat: new Date().toISOString()
        });
        sauvegarderProduitsAchetes(produitsAchetes);

        alert("✅ Achat réussi !\n" + produit.nom + " a été ajouté à tes produits.");

        // Mettre à jour l'affichage si on est sur la page produits
        afficherProduitsAchetes();
        afficherSoldesCompte();
    });

});


// =====================================
// BONUS QUOTIDIEN
// =====================================

if (bonusButton) {

    bonusButton.addEventListener("click", function () {

        const aujourdHui = new Date().toDateString();

        const dernierBonus = localStorage.getItem("dernierBonus");

        if (dernierBonus === aujourdHui) {

            alert("Vous avez déjà reçu votre bonus aujourd'hui.");

            return;

        }

        soldeRetrait += 50;

        afficherSoldeRetrait();

        localStorage.setItem("dernierBonus", aujourdHui);

        alert("🎁 Bonus quotidien de 50 F ajouté au solde de retrait.");

    });

}

// =====================================
// MESSAGE DE DEMARRAGE
// =====================================



console.log(
"S.A.G.E est chargé correctement."
);

// =====================================
// PAGE COMPTE - BOUTONS
// =====================================

const accountRechargeBtn = document.getElementById("accountRechargeBtn");
const accountWithdrawBtn = document.getElementById("accountWithdrawBtn");


const accountTeamBtn = document.getElementById("accountTeamBtn");
const accountBonusBtn = document.getElementById("accountBonusBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Afficher les soldes dans la page compte
function afficherSoldesCompte() {
    const rechargeBal = document.getElementById("accountRechargeBalance");
    const withdrawBal = document.getElementById("accountWithdrawBalance");

    let soldeRecharge = Number(localStorage.getItem("soldeRecharge")) || 0;
    let soldeRetrait = Number(localStorage.getItem("soldeRetrait")) || 0;

    if (rechargeBal) {
        rechargeBal.innerText = soldeRecharge.toLocaleString() + " F";
    }
    if (withdrawBal) {
        withdrawBal.innerText = soldeRetrait.toLocaleString() + " F";
    }
}

// Mettre à jour les soldes quand on ouvre la page compte
if (navAccount) {
    navAccount.addEventListener("click", function () {
        afficherSoldesCompte();
        chargerCompte();
    });
}

// Bouton Recharger (page compte)
if (accountRechargeBtn) {
    accountRechargeBtn.addEventListener("click", function () {
        if (rechargeWindow) {
            rechargeWindow.classList.remove("hidden");
        }
    });
}

// Bouton Retirer (page compte)
if (accountWithdrawBtn) {
    accountWithdrawBtn.addEventListener("click", function () {
        if (withdrawWindow) {
            withdrawWindow.classList.remove("hidden");
        }
    });
}

// Bouton Mon équipe
if (accountTeamBtn) {
    accountTeamBtn.addEventListener("click", function () {
        afficherPage(teamSection);
    });
}

// Bouton Bonus
if (accountBonusBtn) {
    accountBonusBtn.addEventListener("click", function () {
        if (bonusButton) {
            bonusButton.click();
        }
    });
}

// Bouton Déconnexion
if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        // On cache toutes les pages
        cacherToutesLesPages();

        // On réaffiche la page de connexion
        const authSection = document.querySelector(".auth-section");
        if (authSection) {
            authSection.classList.remove("hidden");
        }

        // On remet l'onglet Connexion actif
        if (loginTab && registerTab) {
            loginForm.classList.remove("hidden");
            registerForm.classList.add("hidden");
            loginTab.classList.add("tab-active");
            registerTab.classList.remove("tab-active");
        }
    });
}


// =====================================
// BOUTONS RETOUR
// =====================================

const backFromProducts = document.getElementById("backFromProducts");
const backFromTeam = document.getElementById("backFromTeam");
const backFromAccount = document.getElementById("backFromAccount");

if (backFromProducts) {
    backFromProducts.addEventListener("click", function () {
        afficherPage(homeSection);
    });
}

if (backFromTeam) {
    backFromTeam.addEventListener("click", function () {
        afficherPage(homeSection);
    });
}

if (backFromAccount) {
    backFromAccount.addEventListener("click", function () {
        afficherPage(homeSection);
    });
}

// =====================================
// CALCUL AUTOMATIQUE MONTANT REÇU (80%)
// =====================================

const withdrawAmountInput = document.querySelector("#withdrawWindow input[type='number']");

if (withdrawAmountInput) {
    withdrawAmountInput.addEventListener("input", function () {
        const montant = Number(this.value) || 0;
        const recu = Math.floor(montant * 0.8); // 80 %
        const montantRecuSpan = document.getElementById("montantRecu");

        if (montantRecuSpan) {
            montantRecuSpan.innerText = recu.toLocaleString() + " F";
        }
    });
}


// =====================================
// SYSTÈME RECHARGE MANUEL
// =====================================

let selectedMethod = "";
let currentRechargeAmount = 0;

const rechargeStep1 = document.getElementById("rechargeStep1");
const rechargeStep2 = document.getElementById("rechargeStep2");
const rechargeStep3 = document.getElementById("rechargeStep3");

const rechargeAmount = document.getElementById("rechargeAmount");
const rechargeNext1 = document.getElementById("rechargeNext1");
const chooseMTN = document.getElementById("chooseMTN");
const chooseOrange = document.getElementById("chooseOrange");
const rechargeBack1 = document.getElementById("rechargeBack1");
const rechargeBack2 = document.getElementById("rechargeBack2");
const displayAmount = document.getElementById("displayAmount");
const depositNumber = document.getElementById("depositNumber");
const copyNumberBtn = document.getElementById("copyNumberBtn");
const submitRecharge = document.getElementById("submitRecharge");
const closeRecharge = document.getElementById("closeRecharge");

// Ouvrir la fenêtre recharge (réinitialiser)
function ouvrirRecharge() {
    rechargeStep1.classList.remove("hidden");
    rechargeStep2.classList.add("hidden");
    rechargeStep3.classList.add("hidden");
    if (rechargeAmount) rechargeAmount.value = "";
    rechargeWindow.classList.remove("hidden");
}

// Boutons d'ouverture
if (rechargeButton) {
    rechargeButton.addEventListener("click", ouvrirRecharge);
}
if (accountRechargeBtn) {
    accountRechargeBtn.addEventListener("click", ouvrirRecharge);
}

// Étape 1 → Étape 2
if (rechargeNext1) {
    rechargeNext1.addEventListener("click", function () {
        const montant = Number(rechargeAmount.value);
        if (!montant || montant < 5000) {
            alert("Le montant minimum de recharge est de 5000 F");
            return;
        }
        currentRechargeAmount = montant;
        rechargeStep1.classList.add("hidden");
        rechargeStep2.classList.remove("hidden");
    });
}

// Choisir MTN
if (chooseMTN) {
    chooseMTN.addEventListener("click", function () {
        selectedMethod = "MTN";
        depositNumber.innerText = "652267492";
        displayAmount.innerText = currentRechargeAmount.toLocaleString() + " F";
        rechargeStep2.classList.add("hidden");
        rechargeStep3.classList.remove("hidden");
    });
}

// Choisir Orange
if (chooseOrange) {
    chooseOrange.addEventListener("click", function () {
        selectedMethod = "Orange";
        depositNumber.innerText = "657142943";
        displayAmount.innerText = currentRechargeAmount.toLocaleString() + " F";
        rechargeStep2.classList.add("hidden");
        rechargeStep3.classList.remove("hidden");
    });
}

// Boutons retour
if (rechargeBack1) {
    rechargeBack1.addEventListener("click", function () {
        rechargeStep2.classList.add("hidden");
        rechargeStep1.classList.remove("hidden");
    });
}
if (rechargeBack2) {
    rechargeBack2.addEventListener("click", function () {
        rechargeStep3.classList.add("hidden");
        rechargeStep2.classList.remove("hidden");
    });
}

// Copier le numéro
if (copyNumberBtn) {
    copyNumberBtn.addEventListener("click", function () {
        const numero = depositNumber.innerText;
        navigator.clipboard.writeText(numero).then(() => {
            alert("Numéro copié : " + numero);
        }).catch(() => {
            alert("Numéro : " + numero);
        });
    });
}

// Soumettre la recharge




if (submitRecharge) {
    submitRecharge.addEventListener("click", function () {
        const sender = document.getElementById("senderPhone").value;

        if (!sender) {
            alert("Veuillez indiquer le numéro avec lequel vous envoyez");
            return;
        }

        let phoneActuel = localStorage.getItem("utilisateurActuel") || "";
        let nomActuel = localStorage.getItem("nomUtilisateur") || "";
        let dateInscription = "";

        let comptes = JSON.parse(localStorage.getItem("tousLesComptes") || "{}");
        if (phoneActuel && comptes[phoneActuel]) {
            dateInscription = comptes[phoneActuel].dateInscription || "";
        }

        let demandes = JSON.parse(localStorage.getItem("demandesRecharge") || "[]");
        demandes.push({
            id: Date.now(),
            telephone: phoneActuel,
            nom: nomActuel,
            dateInscription: dateInscription,
            montant: currentRechargeAmount,
            methode: selectedMethod,
            numeroEnvoi: sender,
            date: new Date().toLocaleString(),
            statut: "En attente"
        });
        localStorage.setItem("demandesRecharge", JSON.stringify(demandes));

        alert("✅ Demande de recharge envoyée !\nElle sera validée après vérification.");
        rechargeWindow.classList.add("hidden");
    });
}










// Fermer
if (closeRecharge) {
    closeRecharge.addEventListener("click", function () {
        rechargeWindow.classList.add("hidden");
    });
}

// =====================================
// SYSTÈME RETRAIT MANUEL
// =====================================

const withdrawNoMethod = document.getElementById("withdrawNoMethod");
const registerMethodForm = document.getElementById("registerMethodForm");
const withdrawForm = document.getElementById("withdrawForm");
const withdrawHistory = document.getElementById("withdrawHistory");

const goToRegisterMethod = document.getElementById("goToRegisterMethod");
const saveMethodBtn = document.getElementById("saveMethodBtn");
const cancelRegisterMethod = document.getElementById("cancelRegisterMethod");
const submitWithdraw = document.getElementById("submitWithdraw");
const showWithdrawHistory = document.getElementById("showWithdrawHistory");
const backFromHistory = document.getElementById("backFromHistory");
const closeWithdraw = document.getElementById("closeWithdraw");
const withdrawAmountInputNew = document.getElementById("withdrawAmount");

function ouvrirRetrait() {
    const methode = localStorage.getItem("methodeRetrait");

    withdrawNoMethod.classList.add("hidden");
    registerMethodForm.classList.add("hidden");
    withdrawForm.classList.add("hidden");
    withdrawHistory.classList.add("hidden");

    if (!methode) {
        withdrawNoMethod.classList.remove("hidden");
    } else {
        withdrawForm.classList.remove("hidden");
        const solde = Number(localStorage.getItem("soldeRetrait")) || 0;
        document.getElementById("availableBalance").innerText = solde.toLocaleString() + " F";
    }

    withdrawWindow.classList.remove("hidden");
}

if (withdrawButton) {
    withdrawButton.addEventListener("click", ouvrirRetrait);
}
if (accountWithdrawBtn) {
    accountWithdrawBtn.addEventListener("click", ouvrirRetrait);
}

// Aller à l'enregistrement
if (goToRegisterMethod) {
    goToRegisterMethod.addEventListener("click", function () {
        withdrawNoMethod.classList.add("hidden");
        registerMethodForm.classList.remove("hidden");
    });
}

// Annuler enregistrement
if (cancelRegisterMethod) {
    cancelRegisterMethod.addEventListener("click", function () {
        registerMethodForm.classList.add("hidden");
        withdrawNoMethod.classList.remove("hidden");
    });
}

// Sauvegarder la méthode
if (saveMethodBtn) {
    saveMethodBtn.addEventListener("click", function () {
        const type = document.getElementById("methodType").value;
        const phone = document.getElementById("receivePhone").value;
        const owner = document.getElementById("simOwner").value;

        if (!phone || !owner) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        localStorage.setItem("methodeRetrait", JSON.stringify({
            type: type,
            phone: phone,
            owner: owner
        }));

        alert("Méthode de retrait enregistrée !");
        registerMethodForm.classList.add("hidden");
        withdrawForm.classList.remove("hidden");

        const solde = Number(localStorage.getItem("soldeRetrait")) || 0;
        document.getElementById("availableBalance").innerText = solde.toLocaleString() + " F";
    });
}

// Calcul 80 %
if (withdrawAmountInputNew) {
    withdrawAmountInputNew.addEventListener("input", function () {
        const montant = Number(this.value) || 0;
        const recu = Math.floor(montant * 0.8);
        document.getElementById("montantRecu").innerText = recu.toLocaleString() + " F";
    });
}




// Demander un retrait


if (submitWithdraw) {
    submitWithdraw.addEventListener("click", function () {
        const montant = Number(withdrawAmountInputNew.value);
        const solde = Number(localStorage.getItem("soldeRetrait")) || 0;

        if (!montant || montant < 2000) {
            alert("Le montant minimum de retrait est de 2000 F");
            return;
        }
        if (montant > solde) {
            alert("Solde insuffisant");
            return;
        }

        // Déduire le solde
        const nouveauSolde = solde - montant;
        localStorage.setItem("soldeRetrait", nouveauSolde);

        const el1 = document.getElementById("withdrawBalance");
        const el2 = document.getElementById("accountWithdrawBalance");
        const el3 = document.getElementById("availableBalance");
        if (el1) el1.innerText = nouveauSolde.toLocaleString() + " F";
        if (el2) el2.innerText = nouveauSolde.toLocaleString() + " F";
        if (el3) el3.innerText = nouveauSolde.toLocaleString() + " F";

        // Infos utilisateur
        let phoneActuel = localStorage.getItem("utilisateurActuel") || "";
        let nomActuel = localStorage.getItem("nomUtilisateur") || "";
        let dateInscription = "";
        let methode = null;

        let comptes = JSON.parse(localStorage.getItem("tousLesComptes") || "{}");
        if (phoneActuel && comptes[phoneActuel]) {
            dateInscription = comptes[phoneActuel].dateInscription || "";
            comptes[phoneActuel].soldeRetrait = nouveauSolde;
            localStorage.setItem("tousLesComptes", JSON.stringify(comptes));
        }

        try {
            methode = JSON.parse(localStorage.getItem("methodeRetrait") || "null");
        } catch(e) {
            methode = null;
        }

        // Sauvegarder la demande
        let retraits = JSON.parse(localStorage.getItem("demandesRetrait") || "[]");
        retraits.push({
            id: Date.now(),
            telephone: phoneActuel,
            nom: nomActuel,
            dateInscription: dateInscription,
            montant: montant,
            recu: Math.floor(montant * 0.8),
            date: new Date().toLocaleString(),
            statut: "En attente",
            methode: methode
        });
        localStorage.setItem("demandesRetrait", JSON.stringify(retraits));

        alert("✅ Demande de retrait envoyée !\nVous recevrez " + Math.floor(montant * 0.8).toLocaleString() + " F après validation.");
        withdrawWindow.classList.add("hidden");
    });
}




// Voir historique
if (showWithdrawHistory) {
    showWithdrawHistory.addEventListener("click", function () {
        withdrawForm.classList.add("hidden");
        withdrawHistory.classList.remove("hidden");

        const liste = document.getElementById("historyList");
        const retraits = JSON.parse(localStorage.getItem("demandesRetrait") || "[]");

        if (retraits.length === 0) {
            liste.innerHTML = "<p>Aucun retrait pour le moment.</p>";
        } else {
            
            
            
            
            
            
            liste.innerHTML = "";
retraits.forEach(function(r) {
    let couleur = "#666";
    if (r.statut === "Validé") couleur = "green";
    if (r.statut === "Refusé") couleur = "red";

    liste.innerHTML += 
        '<div style="background:#f5f5f5;padding:12px;border-radius:12px;margin-bottom:10px;text-align:left;">' +
            '<strong>' + r.date + '</strong><br>' +
            'Montant : ' + r.montant.toLocaleString() + ' F<br>' +
            'Reçu : ' + r.recu.toLocaleString() + ' F<br>' +
            'Statut : <span style="color:' + couleur + '">' + r.statut + '</span>' +
        '</div>';
});




                    
        }
    });
}



if (backFromHistory) {
    backFromHistory.addEventListener("click", function () {
        withdrawHistory.classList.add("hidden");
        withdrawForm.classList.remove("hidden");
    });
}

if (closeWithdraw) {
    closeWithdraw.addEventListener("click", function () {
        withdrawWindow.classList.add("hidden");
    });
}

// =====================================
// BOUTON INVITER (page d'accueil)
// =====================================

const inviteButton = document.getElementById("inviteButton");

if (inviteButton) {
    inviteButton.addEventListener("click", function () {
        afficherPage(teamSection);
        
        if (typeof chargerEquipe === "function") {
            chargerEquipe();
        }
    });
}


// =====================================
// CODE PARRAIN AUTOMATIQUE DEPUIS LE LIEN
// =====================================

function getCodeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("code");
}

window.addEventListener("DOMContentLoaded", function () {
    const codeFromLink = getCodeFromUrl();

    if (codeFromLink) {
        // Passer automatiquement sur l'onglet Inscription
        if (registerTab && loginTab && registerForm && loginForm) {
            registerForm.classList.remove("hidden");
            loginForm.classList.add("hidden");
            registerTab.classList.add("tab-active");
            loginTab.classList.remove("tab-active");
        }

        // Remplir le champ Code invitation et le bloquer
        const inviteInput = document.getElementById("inviteCode");
        if (inviteInput) {
            inviteInput.value = codeFromLink.toUpperCase();
            inviteInput.readOnly = true;
            inviteInput.style.background = "#f0f7f0";
            inviteInput.style.color = "#0b8f3c";
            inviteInput.style.fontWeight = "bold";
        }
    }
});


// =====================================
// SYSTÈME D'ACHAT DE PRODUITS
// =====================================

function getProduitsAchetes() {
    return JSON.parse(localStorage.getItem("produitsAchetes") || "[]");
}

function sauvegarderProduitsAchetes(liste) {
    localStorage.setItem("produitsAchetes", JSON.stringify(liste));
}

function afficherProduitsAchetes() {
    const conteneur = document.getElementById("myProducts");
    const messageVide = document.getElementById("noProductsMessage");
    const produits = getProduitsAchetes();

    const imageMap = {
        "aspirateur": "images/aspirateur.png",
        "scie-disque": "images/scie-disque.png",
        "perceuse": "images/perceuse.png",
        "pulverisateur": "images/pulverisateur.png",
        "tronconneuse": "images/tronçonneuse.png",
        "tracteur": "images/tracteur.png",
        "debroussailleuse": "images/debroussailleuse.png"
    };

    // Supprimer les anciennes cartes
    const anciennesCartes = conteneur.querySelectorAll(".purchased-product");
    anciennesCartes.forEach(function(c) {
        c.remove();
    });

    if (produits.length === 0) {
        if (messageVide) messageVide.style.display = "block";
        return;
    }

    if (messageVide) messageVide.style.display = "none";

    produits.forEach(function(p) {
        
        const joursDejaVerses = p.joursDejaVerses || 0;
        const joursRestants = Math.max(0, p.duree - joursDejaVerses);
        const revenusAccumules = joursDejaVerses * p.gainJour;

        const imageSrc = imageMap[p.id] || "images/logo.png";

        const carte = document.createElement("div");
        carte.className = "purchased-product";

        carte.innerHTML = 
            '<div class="purchased-header">' +
                '<img src="' + imageSrc + '" alt="' + p.nom + '">' +
                '<h3>' + p.nom + '</h3>' +
            '</div>' +
            '<div class="purchased-details">' +
                '<div>Prix d\'achat<span>' + p.prix.toLocaleString() + ' F</span></div>' +
                '<div>Revenu / jour<span>' + p.gainJour.toLocaleString() + ' F</span></div>' +
                '<div>Déjà gagné<span>' + revenusAccumules.toLocaleString() + ' F</span></div>' +
                '<div>Jours restants<span>' + joursRestants + ' j</span></div>' +
                '<div style="grid-column: span 2;">Date d\'achat<span>' + new Date(p.dateAchat).toLocaleDateString('fr-FR') + '</span></div>' +
            '</div>';

        conteneur.appendChild(carte);
    });
}





// Quand on ouvre la page Produits
if (navProducts) {
    navProducts.addEventListener("click", function () {
        afficherProduitsAchetes();
        // Mettre à jour aussi les soldes
        const soldeR = Number(localStorage.getItem("soldeRecharge")) || 0;
        const soldeW = Number(localStorage.getItem("soldeRetrait")) || 0;
        const elR = document.getElementById("rechargeBalance");
        const elW = document.getElementById("withdrawBalance");
        if (elR) elR.innerText = soldeR.toLocaleString() + " F";
        if (elW) elW.innerText = soldeW.toLocaleString() + " F";
    });
}


// =====================================
// GAINS QUOTIDIENS AUTOMATIQUES
// =====================================

function verserGainsAutomatiques() {
    let produits = getProduitsAchetes();
    let soldeRetrait = Number(localStorage.getItem("soldeRetrait")) || 0;
    let totalVerse = 0;
    let aChange = false;

    produits.forEach(function(p) {
        // Date du dernier versement (ou date d'achat si jamais versé)
        let dernierVersement = p.dernierVersement ? new Date(p.dernierVersement) : new Date(p.dateAchat);
        let maintenant = new Date();

        // Nombre de jours complets de 24h passés
        let diffMs = maintenant - dernierVersement;
        let joursComplets = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        

        // On ne peut pas dépasser la durée du produit
        let joursRestantsMax = p.duree - (p.joursDejaVerses || 0);
        let joursAVerser = Math.min(joursComplets, joursRestantsMax);

        if (joursAVerser > 0) {
            let montant = joursAVerser * p.gainJour;
            soldeRetrait += montant;
            totalVerse += montant;

            // Mettre à jour le produit
            p.joursDejaVerses = (p.joursDejaVerses || 0) + joursAVerser;
            p.dernierVersement = maintenant.toISOString();
            aChange = true;
        }
    });

    
    if (aChange) {
    localStorage.setItem("soldeRetrait", soldeRetrait);
    sauvegarderProduitsAchetes(produits);

    // Mettre à jour partout
    const el1 = document.getElementById("withdrawBalance");
    const el2 = document.getElementById("accountWithdrawBalance");
    const el3 = document.getElementById("availableBalance");

    if (el1) el1.innerText = soldeRetrait.toLocaleString() + " F";
    if (el2) el2.innerText = soldeRetrait.toLocaleString() + " F";
    if (el3) el3.innerText = soldeRetrait.toLocaleString() + " F";


}


}

// On lance la vérification à chaque ouverture de la page Produits
if (navProducts) {
    navProducts.addEventListener("click", function () {
        verserGainsAutomatiques();
        afficherProduitsAchetes();
    });
}


// =====================================
// HISTORIQUE DES TRANSACTIONS
// =====================================

const historyWindow = document.getElementById("historyWindow");
const historyContent = document.getElementById("historyContent");
const closeHistory = document.getElementById("closeHistory");

function ouvrirHistorique() {
    if (!historyWindow || !historyContent) return;

    let html = "";

    // 1. Recharges
    const recharges = JSON.parse(localStorage.getItem("demandesRecharge") || "[]");
    recharges.forEach(r => {
        html += `
            <div style="background:#f0f7f0;padding:12px;border-radius:12px;margin-bottom:10px;">
                <strong style="color:#0b8f3c;">Recharge</strong><br>
                ${r.date}<br>
                Montant : ${r.montant.toLocaleString()} F<br>
                Statut : ${r.statut}
            </div>
        `;
    });

    // 2. Retraits
    const retraits = JSON.parse(localStorage.getItem("demandesRetrait") || "[]");
    retraits.forEach(r => {
        html += `
            <div style="background:#fff3e0;padding:12px;border-radius:12px;margin-bottom:10px;">
                <strong style="color:#e65100;">Retrait</strong><br>
                ${r.date}<br>
                Montant : ${r.montant.toLocaleString()} F<br>
                Reçu : ${r.recu.toLocaleString()} F<br>
                Statut : ${r.statut}
            </div>
        `;
    });

    // 3. Achats de produits
    const produits = getProduitsAchetes();
    produits.forEach(p => {
        html += `
            <div style="background:#e3f2fd;padding:12px;border-radius:12px;margin-bottom:10px;">
                <strong style="color:#1565c0;">Achat</strong><br>
                ${new Date(p.dateAchat).toLocaleString('fr-FR')}<br>
                Produit : ${p.nom}<br>
                Prix : ${p.prix.toLocaleString()} F
            </div>
        `;
    });

    if (html === "") {
        html = '<p style="text-align:center;color:#999;">Aucun mouvement pour le moment.</p>';
    }

    historyContent.innerHTML = html;
    historyWindow.classList.remove("hidden");
}

// Bouton Historique (page compte)

const historyBtn = document.getElementById("historyBtn");

if (historyBtn) {
    historyBtn.addEventListener("click", function () {
        ouvrirHistorique();
    });
}

// Fermer
if (closeHistory) {
    closeHistory.addEventListener("click", function () {
        historyWindow.classList.add("hidden");
    });
}

if (historyWindow) {
    historyWindow.addEventListener("click", function (e) {
        if (e.target === historyWindow) {
            historyWindow.classList.add("hidden");
        }
    });
}






// =====================================
// PAGE ADMIN
// =====================================

const adminSection = document.getElementById("adminSection");
const backFromAdmin = document.getElementById("backFromAdmin");

function ouvrirAdmin() {
    document.querySelector(".auth-section").classList.add("hidden");
    if (homeSection) homeSection.classList.add("hidden");
    if (productsSection) productsSection.classList.add("hidden");
    if (teamSection) teamSection.classList.add("hidden");
    if (accountSection) accountSection.classList.add("hidden");
    if (adminSection) adminSection.classList.remove("hidden");

    
    chargerAdminRecharges();
    chargerAdminRetraits();
    chargerAdminRequetes();
    demarrerMinuteurAdmin();
    
}

if (backFromAdmin) {
    backFromAdmin.addEventListener("click", function () {
        if (adminSection) adminSection.classList.add("hidden");
        document.querySelector(".auth-section").classList.remove("hidden");
        document.getElementById("loginPhone").value = "";
        document.getElementById("loginPassword").value = "";
    });
}

// Onglets
const adminTabs = document.querySelectorAll(".admin-tab");
adminTabs.forEach(function(tab) {
    tab.addEventListener("click", function () {
        adminTabs.forEach(function(t) { t.classList.remove("active"); });
        this.classList.add("active");

        const type = this.getAttribute("data-tab");
        
        
        
        document.getElementById("adminRecharges").classList.toggle("hidden", type !== "recharges");
document.getElementById("adminRetraits").classList.toggle("hidden", type !== "retraits");
document.getElementById("adminRequetes").classList.toggle("hidden", type !== "requetes");

if (type === "requetes") chargerAdminRequetes();




    });
});



function chargerAdminRecharges() {
    const conteneur = document.getElementById("adminRecharges");
    const demandes = JSON.parse(localStorage.getItem("demandesRecharge") || "[]");

    // Garder seulement les "En attente"
    const enAttente = demandes.filter(function(d) {
        return d.statut === "En attente";
    });

    if (enAttente.length === 0) {
        conteneur.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">Aucune demande de recharge</p>';
        return;
    }

    conteneur.innerHTML = "";

    enAttente.forEach(function(d) {
        const btn = document.createElement("button");
        btn.className = "admin-rect-btn";
        btn.innerHTML = 
            '<span>' + (d.telephone || "---") + '</span>' +
            '<span>' + d.montant.toLocaleString() + ' F</span>';

        btn.addEventListener("click", function () {
            ouvrirFicheRecharge(d);
        });

        conteneur.appendChild(btn);
    });
}

function ouvrirFicheRecharge(d) {
    // Créer la fiche
    let fiche = document.getElementById("ficheAdmin");
    if (!fiche) {
        fiche = document.createElement("div");
        fiche.id = "ficheAdmin";
        fiche.className = "fiche-admin-overlay";
        document.body.appendChild(fiche);
    }

    fiche.innerHTML = 
        '<div class="fiche-admin-content">' +
            '<button class="close-fiche" id="closeFiche">×</button>' +
            '<h3>Détail de la demande</h3>' +
            '<p><strong>Nom :</strong> ' + (d.nom || "---") + '</p>' +
            '<p><strong>Téléphone :</strong> ' + (d.telephone || "---") + '</p>' +
            '<p><strong>Date inscription :</strong> ' + (d.dateInscription || "---") + '</p>' +
            '<hr>' +
            '<p><strong>Montant :</strong> ' + d.montant.toLocaleString() + ' F</p>' +
            '<p><strong>Méthode :</strong> ' + d.methode + '</p>' +
            '<p><strong>N° utilisé :</strong> ' + d.numeroEnvoi + '</p>' +
            '<p><strong>Date demande :</strong> ' + d.date + '</p>' +
            '<hr>' +
            '<h4>Décision</h4>' +
            '<div class="admin-actions">' +
                '<button class="admin-btn-valider" id="btnValiderRecharge">Accepter</button>' +
                '<button class="admin-btn-refuser" id="btnRefuserRecharge">Refuser</button>' +
            '</div>' +
        '</div>';

    fiche.classList.remove("hidden");
    fiche.style.display = "flex";

    // Fermer
    document.getElementById("closeFiche").onclick = function () {
        fiche.style.display = "none";
    };

    // Valider
    document.getElementById("btnValiderRecharge").onclick = function () {
        validerUneRecharge(d);
        fiche.style.display = "none";
    };

    // Refuser
    document.getElementById("btnRefuserRecharge").onclick = function () {
        refuserUneRecharge(d);
        fiche.style.display = "none";
    };
}

function validerUneRecharge(d) {
    let demandes = JSON.parse(localStorage.getItem("demandesRecharge") || "[]");
    let comptes = JSON.parse(localStorage.getItem("tousLesComptes") || "{}");

    // Marquer comme Validé
    for (let i = 0; i < demandes.length; i++) {
        if (demandes[i].id === d.id) {
            demandes[i].statut = "Validé";
            break;
        }
    }
    localStorage.setItem("demandesRecharge", JSON.stringify(demandes));

    // Créditer le solde de l'utilisateur
    if (d.telephone && comptes[d.telephone]) {
        comptes[d.telephone].soldeRecharge = (comptes[d.telephone].soldeRecharge || 0) + d.montant;

        
        // ===== COMMISSIONS MULTI-NIVEAUX (20% / 10% / 1%) =====
if (d.telephone && comptes[d.telephone] && comptes[d.telephone].codeParrain) {

    let codeParrain = comptes[d.telephone].codeParrain;
    const taux = [0.20, 0.10, 0.01]; // Niveau 1, 2, 3

    for (let i = 0; i < 3; i++) {
        if (!codeParrain) break;

        let numParrain = null;

        // Chercher le propriétaire de ce code
        for (let num in comptes) {
            if (comptes[num].codeInvitation === codeParrain) {
                numParrain = num;
                break;
            }
        }

        if (!numParrain) break;

        // Calculer et verser la commission
        let commission = Math.floor(d.montant * taux[i]);
        comptes[numParrain].soldeRetrait = (comptes[numParrain].soldeRetrait || 0) + commission;

        // Mettre à jour le statut du filleul (seulement pour le niveau 1 direct)
        if (i === 0 && comptes[numParrain].mesFilleuls) {
            comptes[numParrain].mesFilleuls.forEach(function(f) {
                if (f.telephone === d.telephone) {
                    f.statut = "actif";
                    f.commission = (f.commission || 0) + commission;
                }
            });
        }

        // Passer au parrain du niveau supérieur
        codeParrain = comptes[numParrain].codeParrain || null;
    }
}







        localStorage.setItem("tousLesComptes", JSON.stringify(comptes));
    }

    alert("Recharge validée : " + d.montant.toLocaleString() + " F crédités");
    chargerAdminRecharges();
}

function refuserUneRecharge(d) {
    let demandes = JSON.parse(localStorage.getItem("demandesRecharge") || "[]");

    for (let i = 0; i < demandes.length; i++) {
        if (demandes[i].id === d.id) {
            demandes[i].statut = "Refusé";
            break;
        }
    }
    localStorage.setItem("demandesRecharge", JSON.stringify(demandes));

    alert("Recharge refusée");
    chargerAdminRecharges();
}





// =====================================
// MINUTEUR ADMIN 3 MINUTES
// =====================================

let minuteurAdmin = null;

function demarrerMinuteurAdmin() {
    if (minuteurAdmin) clearTimeout(minuteurAdmin);

    let secondes = 180;

    let timerDiv = document.getElementById("adminTimer");
    if (!timerDiv) {
        timerDiv = document.createElement("div");
        timerDiv.id = "adminTimer";
        timerDiv.style.cssText = "text-align:center;color:#d32f2f;font-weight:bold;padding:12px;font-size:15px;";
        const header = document.querySelector("#adminSection .inside-header");
        if (header) header.after(timerDiv);
    }

    function update() {
        let min = Math.floor(secondes / 60);
        let sec = secondes % 60;
        timerDiv.innerText = "⏱ Fermeture automatique dans " + min + ":" + (sec < 10 ? "0" : "") + sec;

        if (secondes <= 0) {
            fermerAdminAuto();
            return;
        }
        secondes--;
        minuteurAdmin = setTimeout(update, 1000);
    }

    update();
}

function fermerAdminAuto() {
    if (minuteurAdmin) clearTimeout(minuteurAdmin);

    if (adminSection) adminSection.classList.add("hidden");
    document.querySelector(".auth-section").classList.remove("hidden");

    document.getElementById("loginPhone").value = "";
    document.getElementById("loginPassword").value = "";

    alert("Session Admin terminée.\nRetour à la connexion.");
}




function chargerAdminRetraits() {
    const conteneur = document.getElementById("adminRetraits");
    if (!conteneur) return;

    const demandes = JSON.parse(localStorage.getItem("demandesRetrait") || "[]");
    const enAttente = demandes.filter(function(d) {
        return d.statut === "En attente";
    });

    if (enAttente.length === 0) {
        conteneur.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">Aucune demande de retrait</p>';
        return;
    }

    conteneur.innerHTML = "";
    enAttente.forEach(function(d) {
        const btn = document.createElement("button");
        btn.className = "admin-rect-btn";
        btn.innerHTML = 
            '<span>' + (d.telephone || "---") + '</span>' +
            '<span>' + d.montant.toLocaleString() + ' F</span>';

        btn.addEventListener("click", function () {
            ouvrirFicheRetrait(d);
        });

        conteneur.appendChild(btn);
    });
}

function ouvrirFicheRetrait(d) {
    let fiche = document.getElementById("ficheAdmin");
    if (!fiche) {
        fiche = document.createElement("div");
        fiche.id = "ficheAdmin";
        fiche.className = "fiche-admin-overlay";
        document.body.appendChild(fiche);
    }

    let methodeTxt = "Non renseignée";
    if (d.methode) {
        methodeTxt = (d.methode.type || "") + " - " + (d.methode.phone || "") + " (" + (d.methode.owner || "") + ")";
    }

    fiche.innerHTML = 
        '<div class="fiche-admin-content">' +
            '<button class="close-fiche" id="closeFiche">×</button>' +
            '<h3>Détail du retrait</h3>' +
            '<p><strong>Nom :</strong> ' + (d.nom || "---") + '</p>' +
            '<p><strong>Téléphone :</strong> ' + (d.telephone || "---") + '</p>' +
            '<p><strong>Date inscription :</strong> ' + (d.dateInscription || "---") + '</p>' +
            '<hr>' +
            '<p><strong>Montant demandé :</strong> ' + d.montant.toLocaleString() + ' F</p>' +
            '<p><strong>À recevoir (80%) :</strong> ' + d.recu.toLocaleString() + ' F</p>' +
            '<p><strong>Date demande :</strong> ' + d.date + '</p>' +
            '<p><strong>Méthode :</strong> ' + methodeTxt + '</p>' +
            '<hr>' +
            '<h4>Décision</h4>' +
            '<div class="admin-actions">' +
                '<button class="admin-btn-valider" id="btnValiderRetrait">Accepter</button>' +
                '<button class="admin-btn-refuser" id="btnRefuserRetrait">Refuser</button>' +
            '</div>' +
        '</div>';

    fiche.style.display = "flex";

    document.getElementById("closeFiche").onclick = function () {
        fiche.style.display = "none";
    };

    document.getElementById("btnValiderRetrait").onclick = function () {
        validerUnRetrait(d);
        fiche.style.display = "none";
    };

    document.getElementById("btnRefuserRetrait").onclick = function () {
        refuserUnRetrait(d);
        fiche.style.display = "none";
    };
}

function validerUnRetrait(d) {
    let demandes = JSON.parse(localStorage.getItem("demandesRetrait") || "[]");

    for (let i = 0; i < demandes.length; i++) {
        if (demandes[i].id === d.id) {
            demandes[i].statut = "Validé";
            break;
        }
    }
    localStorage.setItem("demandesRetrait", JSON.stringify(demandes));

    alert("Retrait validé.\nEnvoie " + d.recu.toLocaleString() + " F au client.");
    chargerAdminRetraits();
}

function refuserUnRetrait(d) {
    let demandes = JSON.parse(localStorage.getItem("demandesRetrait") || "[]");
    let comptes = JSON.parse(localStorage.getItem("tousLesComptes") || "{}");

    // Rendre l'argent
    if (d.telephone && comptes[d.telephone]) {
        comptes[d.telephone].soldeRetrait = (comptes[d.telephone].soldeRetrait || 0) + d.montant;
        localStorage.setItem("tousLesComptes", JSON.stringify(comptes));
    }

    for (let i = 0; i < demandes.length; i++) {
        if (demandes[i].id === d.id) {
            demandes[i].statut = "Refusé";
            break;
        }
    }
    localStorage.setItem("demandesRetrait", JSON.stringify(demandes));

    alert("Retrait refusé – argent rendu au client.");
    chargerAdminRetraits();
}



// =====================================
// SYSTÈME DE REQUÊTES
// =====================================

const requeteBtn = document.getElementById("requeteBtn");
const requeteWindow = document.getElementById("requeteWindow");
const submitRequete = document.getElementById("submitRequete");
const closeRequete = document.getElementById("closeRequete");

// Ouvrir la fenêtre requête



if (requeteBtn) {
    requeteBtn.addEventListener("click", function () {
        if (requeteWindow) {
            // Afficher les anciennes requêtes du client
            const phoneActuel = localStorage.getItem("utilisateurActuel") || "";
            const toutes = JSON.parse(localStorage.getItem("requetesClients") || "[]");
            const mesRequetes = toutes.filter(function(r) {
                return r.telephone === phoneActuel;
            });

            let historiqueHtml = "";
            if (mesRequetes.length > 0) {
                historiqueHtml = '<div style="max-height:180px;overflow-y:auto;margin-bottom:15px;text-align:left;">';
                mesRequetes.slice().reverse().forEach(function(r) {
                    let couleur = r.statut === "Répondu" ? "#0b8f3c" : "#e65100";
                    historiqueHtml += 
                        '<div style="background:#f5f5f5;padding:10px;border-radius:10px;margin-bottom:8px;font-size:13px;">' +
                            '<strong style="color:' + couleur + ';">' + r.statut + '</strong> — ' + r.date + '<br>' +
                            '<em>' + r.message + '</em>';
                    if (r.reponse) {
                        historiqueHtml += '<br><strong style="color:#0b8f3c;">Réponse :</strong> ' + r.reponse;
                    }
                    historiqueHtml += '</div>';
                });
                historiqueHtml += '</div><hr style="margin:10px 0;border:none;border-top:1px solid #eee;">';
            }

            // On injecte l'historique juste au-dessus du formulaire
            const contenu = requeteWindow.querySelector(".popup-content");
            let zone = document.getElementById("mesRequetesZone");
            if (!zone) {
                zone = document.createElement("div");
                zone.id = "mesRequetesZone";
                contenu.insertBefore(zone, contenu.children[1]);
            }
            zone.innerHTML = historiqueHtml;

            requeteWindow.classList.remove("hidden");
        }
    });
}




// Fermer
if (closeRequete) {
    closeRequete.addEventListener("click", function () {
        requeteWindow.classList.add("hidden");
    });
}

if (requeteWindow) {
    requeteWindow.addEventListener("click", function (e) {
        if (e.target === requeteWindow) {
            requeteWindow.classList.add("hidden");
        }
    });
}

// Envoyer la requête
if (submitRequete) {
    submitRequete.addEventListener("click", function () {
        const message = document.getElementById("requeteMessage").value.trim();
        const imageInput = document.getElementById("requeteImage");

        if (!message) {
            alert("Écrivez un message");
            return;
        }

        let phoneActuel = localStorage.getItem("utilisateurActuel") || "";
        let nomActuel = localStorage.getItem("nomUtilisateur") || "";

        function sauvegarderRequete(imageBase64) {
            let requetes = JSON.parse(localStorage.getItem("requetesClients") || "[]");
            requetes.push({
                id: Date.now(),
                telephone: phoneActuel,
                nom: nomActuel,
                message: message,
                image: imageBase64 || null,
                date: new Date().toLocaleString(),
                statut: "En attente",
                reponse: null
            });
            localStorage.setItem("requetesClients", JSON.stringify(requetes));

            alert("✅ Requête envoyée !");
            document.getElementById("requeteMessage").value = "";
            if (imageInput) imageInput.value = "";
            requeteWindow.classList.add("hidden");
        }

        // Si image choisie
        if (imageInput && imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                sauvegarderRequete(e.target.result);
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            sauvegarderRequete(null);
        }
    });
}



function chargerAdminRequetes() {
    const conteneur = document.getElementById("adminRequetes");
    if (!conteneur) return;

    const requetes = JSON.parse(localStorage.getItem("requetesClients") || "[]");
    const enAttente = requetes.filter(function(r) {
        return r.statut === "En attente";
    });

    if (enAttente.length === 0) {
        conteneur.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">Aucune requête</p>';
        return;
    }

    conteneur.innerHTML = "";
    enAttente.forEach(function(r) {
        const btn = document.createElement("button");
        btn.className = "admin-rect-btn";
        btn.innerHTML = 
            '<span>' + (r.nom || r.telephone || "---") + '</span>' +
            '<span>Requête</span>';

        btn.addEventListener("click", function () {
            ouvrirFicheRequete(r);
        });

        conteneur.appendChild(btn);
    });
}

function ouvrirFicheRequete(r) {
    let fiche = document.getElementById("ficheAdmin");
    if (!fiche) {
        fiche = document.createElement("div");
        fiche.id = "ficheAdmin";
        fiche.className = "fiche-admin-overlay";
        document.body.appendChild(fiche);
    }

    let imageHtml = "";
    if (r.image) {
        imageHtml = '<img src="' + r.image + '" style="width:100%;border-radius:12px;margin:10px 0;">';
    }

    fiche.innerHTML = 
        '<div class="fiche-admin-content">' +
            '<button class="close-fiche" id="closeFiche">×</button>' +
            '<h3>Requête client</h3>' +
            '<p><strong>Nom :</strong> ' + (r.nom || "---") + '</p>' +
            '<p><strong>Téléphone :</strong> ' + (r.telephone || "---") + '</p>' +
            '<p><strong>Date :</strong> ' + r.date + '</p>' +
            '<hr>' +
            '<p><strong>Message :</strong></p>' +
            '<p style="background:#f5f5f5;padding:12px;border-radius:10px;">' + r.message + '</p>' +
            imageHtml +
            '<hr>' +
            '<h4>Répondre</h4>' +
            '<textarea id="reponseAdmin" rows="3" placeholder="Votre réponse..." style="width:100%;padding:10px;border-radius:10px;border:1px solid #ddd;"></textarea>' +
            '<div class="admin-actions" style="margin-top:12px;">' +
                '<button class="admin-btn-valider" id="btnRepondreRequete">Envoyer la réponse</button>' +
            '</div>' +
        '</div>';

    fiche.style.display = "flex";

    document.getElementById("closeFiche").onclick = function () {
        fiche.style.display = "none";
    };

    document.getElementById("btnRepondreRequete").onclick = function () {
        const reponse = document.getElementById("reponseAdmin").value.trim();
        if (!reponse) {
            alert("Écrivez une réponse");
            return;
        }

        let requetes = JSON.parse(localStorage.getItem("requetesClients") || "[]");
        for (let i = 0; i < requetes.length; i++) {
            if (requetes[i].id === r.id) {
                requetes[i].statut = "Répondu";
                requetes[i].reponse = reponse;
                break;
            }
        }
        localStorage.setItem("requetesClients", JSON.stringify(requetes));

        alert("Réponse enregistrée");
        fiche.style.display = "none";
        chargerAdminRequetes();
    };
}

