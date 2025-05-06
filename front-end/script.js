document.addEventListener("DOMContentLoaded", async () => {
  const menu = document.getElementById("menu");
  const container = document.getElementById("product-container");

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
    console.log("Catégories récupérées :", categories);
    
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
                ${product.name}
                <br>
                ${product.price} €
              `;

              // Clic produit
              prodButton.addEventListener("click", event => {
                const productId = event.currentTarget.dataset.id;
                const randomNum = Math.floor(Math.random() * 100) + 1;
                const storageKey = "produit" + randomNum;
                localStorage.setItem(storageKey, productId);
                console.log(`Produit enregistré sous "${storageKey}": ${productId}`);

                // === Gestion pop-up ===
                if (product.type) {
                  if (product.type.toString() === "1") {
                    openPopupMultiple(product);
                  } else {
                    openPopupSingle("http://localhost:3000/products", product);
                  }
                }
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

        popup.innerHTML = `<button id="close-popup">Fermer</button><h3>Sélectionnez un produit (${selectionCount + 1}/5)</h3>`;

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
            const rand = Math.floor(Math.random() * 100) + 1;
            const key = "produit" + rand;
            localStorage.setItem(key, selectedId);
            console.log(`Produit sélectionné enregistré sous "${key}": ${selectedId}`);

            selectionCount++;
            popup.innerHTML = "";
            if (selectionCount < endpoints.length) {
              fetchAndShow();
            } else {
              popup.classList.add("hidden");
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
      if (product.id === 37 || product.id === 38 || product.id === 39 || product.id === 40 || product.id === 41) {
        finalApiUrl = "http://localhost:3000/products/multi?ids=58,61";
      } else if (product.id === 29 || product.id === 30 || product.id === 31 || product.id === 32 || product.id === 33 || product.id === 34 || product.id === 35 || product.id === 36) {
        finalApiUrl = "http://localhost:3000/products/multi?ids=119,120";
      } else if (product.id === 44 || product.id === 45 ) {
        finalApiUrl = "http://localhost:3000/products/type/9";
      }

      const response = await fetch(finalApiUrl);
      const selectableProducts = await response.json();

      const popup = document.getElementById("popup");
      popup.innerHTML = `<button id="close-popup">Fermer</button><h3>Sélectionnez un produit</h3>`;
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
          const rand = Math.floor(Math.random() * 100) + 1;
          const key = "produit" + rand;
          localStorage.setItem(key, selectedId);
          console.log(`Produit sélectionné enregistré sous "${key}": ${selectedId}`);
          popup.classList.add("hidden");
        });
      });
    } catch (error) {
      console.error("Erreur dans openPopupSingle :", error);
    }
  }
});
