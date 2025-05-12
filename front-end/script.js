// page selection.html ===//
function choisiroption(selection) {
  // Enregistre la sélection dans le localStorage
  localStorage.setItem('selection', selection);

  // Redirige vers la page commande.html
  window.location.href = 'commande.html';
}

//=== page commande.html ===//

document.addEventListener("DOMContentLoaded", async () => {
  const menu = document.getElementById("menu");
  const container = document.getElementById("product-container");
  let lastArticle;
  let lastArticleKey;

  // Vide le localStorage à chaque refresh
  window.addEventListener("load", () => {
    localStorage.clear();
  });

  // Défilement du menu
  document.getElementById("left-arrow").addEventListener("click", () => {
    menu.scrollLeft -= 100;
  });
  document.getElementById("right-arrow").addEventListener("click", () => {
    menu.scrollLeft += 100;
  });

  try {
    // Récupérer les catégories
    const categoriesResponse = await fetch("http://localhost:3000/typeProducts");
    const categories = await categoriesResponse.json();

    categories.forEach(category => {
      // Ignorer la catégorie avec l'ID 47
      if (category.id !== 47) {
        const catButton = document.createElement("button");
        catButton.innerHTML = `
          <img src="annexe/${category.image}" alt="${category.type_name}" class="image-menu">
          <br>
          ${category.type_name}
        `;
        catButton.classList.add("menu-button");
        catButton.dataset.category = category.id;

        // Ajoute l'événement sur le bouton de catégorie
        catButton.addEventListener("click", async () => {
          try {
            const productsResponse = await fetch(`http://localhost:3000/products/type/${category.id}`);
            const products = await productsResponse.json();

            container.innerHTML = "";

            products.forEach(product => {
              const prodButton = document.createElement("button");
              prodButton.classList.add("product-button");
              prodButton.dataset.id = product.id;
              prodButton.innerHTML = `
                <img src="annexe/${product.image}" alt="${product.name}" class="image-product">
                <br>
                <p id="productName">${product.name}</p>
                <br>
                <p id="PriceId">${product.price} € </p>
              `;

              // Clic Article
              prodButton.addEventListener("click", event => {
                const productId = event.currentTarget.dataset.id;
                const priceRaw = document.getElementById("PriceId").innerHTML;
                const priceId = priceRaw.replace("€", "").trim();
                const productName = document.getElementById("productName").innerHTML;
                console.log("Produit ID :", productId);
                console.log("Produit Nom :", productName);
                console.log("Produit Prix :", priceId);
                let ArticleObject = [{ "id": productId, "name": productName, "price": priceId }];
                console.log("Produit Array :", ArticleObject);

                // Enregistrement dans le localStorage
                const randomNum = Math.floor(Math.random() * 50) + 1;
                const ArticleKey = "Article" + randomNum;
                localStorage.setItem(ArticleKey, JSON.stringify(ArticleObject));
                console.log(`Produit enregistré sous "${ArticleKey}": ${ArticleObject}`);

                lastArticle = localStorage.getItem(ArticleKey);
                lastArticleKey = ArticleKey;

                // === Gestion pop-up ===
                if (product.type) {
                  if (product.type.toString() === "1") {
                    openPopupMultiple(product);
                  } else {
                    openPopupSingle("http://localhost:3000/products", product);
                  }
                }

                // ✅ Toujours recalculer le total prix après clic
                calculerTotalPrixArticles();
              });

              container.appendChild(prodButton);
            });
          } catch (error) {
            console.error("Erreur lors de la récupération des produits :", error);
          }
        });

        menu.appendChild(catButton);
      }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
  }

  // === POPUP MULTIPLE ===
  function openPopupMultiple(product) {
    let selectionCount = 0;
    const endpoints = [
      "http://localhost:3000/products/multi?ids=117,118",
      "http://localhost:3000/products/multi?ids=39,40",
      "http://localhost:3000/products/multi?ids=58,61",
      "http://localhost:3000/products/type/6",
      "http://localhost:3000/products/multi?ids=119,120"
    ];

    const fetchAndShow = async () => {
      try {
        const apiToCall = endpoints[selectionCount];
        const response = await fetch(apiToCall);
        const selectableProducts = await response.json();
        const popup = document.getElementById("popup");

        popup.innerHTML = `<button id="close-popup"><img class="close-button" src="./annexe/images/supprimer.png"></button><h3>Sélectionnez un produit (${selectionCount + 1}/5)</h3>`;

        selectableProducts.forEach(item => {
          const itemButton = document.createElement("button");
          itemButton.classList.add("popup-button");
          itemButton.dataset.id = item.id;
          itemButton.innerHTML = `
            <img src="annexe/${item.image}" alt="${item.name}" class="image-popup">
            <br>
            ${item.name} - ${item.price} €
          `;
          popup.appendChild(itemButton);
        });

        popup.classList.remove("hidden");

        document.getElementById("close-popup").addEventListener("click", () => {
          popup.classList.add("hidden");
        });

        const popupButtons = popup.querySelectorAll(".popup-button");
        popupButtons.forEach(popupBtn => {
          popupBtn.addEventListener("click", event => {
            const selectedId = event.currentTarget.dataset.id;
            const selectedName = event.currentTarget.innerText.split(" - ")[0].trim();

            const selectedProduct = {
              id: selectedId,
              name: selectedName,
            };
            let existingArticle = localStorage.getItem(lastArticleKey);
            let articleArray = [];

            if (existingArticle) {
              articleArray = JSON.parse(existingArticle);
            }
            articleArray.push(selectedProduct);
            localStorage.setItem(lastArticleKey, JSON.stringify(articleArray));

            console.log(`Produit sélectionné enregistré sous "${lastArticleKey}":`, articleArray);

            selectionCount++;
            popup.innerHTML = "";
            if (selectionCount < endpoints.length) {
              fetchAndShow();
            } else {
              popup.classList.add("hidden");
              const totalPrix = calculerTotalPrixArticles();
              document.getElementById("order-total").textContent = totalPrix.toFixed(2) + " €";
              console.log("Prix total mis à jour :", totalPrix);
            }
          });
        });
      } catch (error) {
        console.error("Erreur dans openPopupMultiple :", error);
      }
    };

    fetchAndShow();
  }

  // === POPUP SIMPLE ===
  async function openPopupSingle(apiUrl, product) {
    try {
      let finalApiUrl = "";
      console.log("Produit ID :", product.id);
      if ([37, 38, 39, 40, 41].includes(product.id)) {
        finalApiUrl = "http://localhost:3000/products/multi?ids=58,61";
      } else if ([29, 30, 31, 32, 33, 34, 35, 36].includes(product.id)) {
        finalApiUrl = "http://localhost:3000/products/multi?ids=119,120";
      } else if ([44, 45].includes(product.id)) {
        finalApiUrl = "http://localhost:3000/products/type/9";
      }

      const response = await fetch(finalApiUrl);
      const selectableProducts = await response.json();

      const popup = document.getElementById("popup");
      popup.innerHTML = `<button id="close-popup"><img class="close-button" src="./annexe/images/supprimer.png"></button><h3>Sélectionnez un produit</h3>`;
      console.log("Produits sélectionnables :", selectableProducts);

      selectableProducts.forEach(item => {
        const itemButton = document.createElement("button");
        itemButton.classList.add("popup-button");
        itemButton.dataset.id = item.id;
        itemButton.innerHTML = `<img src="annexe${item.image}" alt="${item.name}" class="image-popup"><br>${item.name}`;
        popup.appendChild(itemButton);
      });

      popup.classList.remove("hidden");

      document.getElementById("close-popup").addEventListener("click", () => {
        popup.classList.add("hidden");
      });

      const popupButtons = popup.querySelectorAll(".popup-button");
      popupButtons.forEach(popupBtn => {
        popupBtn.addEventListener("click", event => {
          const selectedId = event.currentTarget.dataset.id;
          const selectedName = event.currentTarget.innerText.split(" - ")[0].trim();

          const selectedProduct = {
            id: selectedId,
            name: selectedName,
          };
          let existingArticle = localStorage.getItem(lastArticleKey);
          let articleArray = [];

          if (existingArticle) {
            articleArray = JSON.parse(existingArticle);
          }
          articleArray.push(selectedProduct);
          localStorage.setItem(lastArticleKey, JSON.stringify(articleArray));

          console.log(`Produit sélectionné enregistré sous "${lastArticleKey}":`, articleArray);

          popup.classList.add("hidden");
          const totalPrix = calculerTotalPrixArticles();
          document.getElementById("order-total").textContent = totalPrix.toFixed(2) + " €";
          console.log("Prix total mis à jour :", totalPrix);
        });
      });
    } catch (error) {
      console.error("Erreur dans openPopupSingle :", error);
    }
  }

  //=== Panier ===//

  const selection = localStorage.getItem('selection');
  const messageElement = document.getElementById('selection-type');

  if (selection === "2") {
    messageElement.textContent = " Sur place 🍽️";
  } else if (selection === "1") {
    messageElement.textContent = "À emporter 🛍️";
  } else {
    messageElement.textContent = "Aucune sélection détectée.";
  }

  function calculerTotalPrixArticles() {
    let total = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      console.log("Clé :", key);
      console.log("Valeur :", localStorage.getItem(key));

      if (key.startsWith("Article")) {
        const articleData = JSON.parse(localStorage.getItem(key));
        console.log("Article Data :", articleData);

        articleData.forEach(article => {
          if (article.price) {
            total += parseFloat(article.price);
            console.log("Prix de l'article :", article.price);
            console.log("Prix total actuel :", total);
          } else {
            console.warn("Article sans prix :", article);
          }
        });
      }
    }

    document.getElementById("order-total").textContent = total.toFixed(2) + " €";
    console.log("Prix total mis à jour :", total);
    return total;
  }

  calculerTotalPrixArticles();

});
