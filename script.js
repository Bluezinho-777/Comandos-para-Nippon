// Inicialização de seletores e estado da aplicação - Nippon Era
const screens = document.querySelectorAll("[data-screen]");
const navigationButtons = document.querySelectorAll("[data-open-screen]");
const shopList = document.querySelector("#shop-list");
const shopSearch = document.querySelector("#shop-search");
const categoryButtons = document.querySelectorAll("[data-category]");
const backgroundLayers = document.querySelectorAll("[data-background-layer]");
const particleField = document.querySelector("#particle-field");
const clickParticleField = document.querySelector("#click-particle-field");
const npcDialog = document.querySelector("#npc-dialog");
const inventoryGrid = document.querySelector("#inventory-grid");
const npcImage = document.querySelector("#npc-image");
const npcButton = document.querySelector("#npc-button");
const npcConversation = document.querySelector("#npc-conversation");
const chatLog = document.querySelector("#chat-log");
const chatOptions = document.querySelector("#chat-options");
const chatPortrait = document.querySelector("#chat-portrait");
const chatStatus = document.querySelector("#chat-status");
const chatHistory = document.querySelector("#chat-history");
const chatCloseButton = document.querySelector("#chat-close-button");
const chatShopAction = document.querySelector("#chat-shop-action");
const chatEndAction = document.querySelector("#chat-end-action");
const authStatus = document.querySelector("#auth-status");
const playerAuthForm = document.querySelector("#player-auth-form");
const creatorAuthForm = document.querySelector("#creator-auth-form");
const createRpgForm = document.querySelector("#create-rpg-form");
const creatorStatus = document.querySelector("#creator-status");
const creatorTabs = document.querySelectorAll("[data-creator-tab]");
const creatorSections = document.querySelectorAll(".creator-section");
const creatorItemForm = document.querySelector("#creator-item-form");
const creatorItemsList = document.querySelector("#creator-items-list");
const creatorInventoryList = document.querySelector("#creator-inventory-list");
const creatorLoreForm = document.querySelector("#creator-lore-form");
const creatorLoreList = document.querySelector("#creator-lore-list");
const creatorLogList = document.querySelector("#creator-log-list");
const loreList = document.querySelector("#lore-list");
const maxVisibleChatMessages = 3;

// Estado global do jogador e jogo
let playerCoins = 150;
let playerEssences = 50; // Nova moeda da segunda loja
let activeShop = "normal"; // Loja ativa ("normal" ou "magic")
let inventoryItems = [];
let shopPriceModifier = 0;
const dialogAnswerIndexes = {};

let firebaseAuth = null;
let firebaseDb = null;
let lastPlayerAuthAction = "player-login";
let currentUser = null;
let currentUserProfile = null;
let currentRpgId = "";
let currentRpgName = "";
let currentMemberRole = "";
let playerInventoryDocs = [];
let rpgLoreEntries = [];

const creatorRoles = ["creator", "owner", "editor", "narrator", "admin"];
const itemEditorRoles = ["creator", "owner", "editor", "admin"];
const loreEditorRoles = ["creator", "owner", "editor", "narrator", "admin"];
const logReaderRoles = ["creator", "owner", "narrator", "admin"];

const backgroundImages = [
  "assets/img/Imagem colada.png",
  "assets/img/Imagem colada (2).png",
  "assets/img/Imagem colada (3).png",
  "assets/img/Imagem colada (4).png",
  "assets/img/Imagem colada (5).png"
];

// Estado de navegação e timers do NPC
let activeCategory = "Todos";
let activeBackgroundIndex = 0;
let activeBackgroundLayer = 0;
let openShopItemId = "";
let openInventoryItemId = "";
let isHoveringItem = false;
let isHoveringNpc = false;
let isTalkingToNpc = false;
let npcTypingTimer = 0;
let npcHideTimer = 0;
let npcIdleTimer = 0;
let defaultLineIndex = 0;
let idleLineIndex = 0;
let hoverLineIndex = 0;
let introLineIndex = 0;
let defaultNpcLine = defaultNpcLines[0];
let currentDialogNode = "main";

// --- PERSISTÊNCIA (localStorage) ---

function saveGameToLocalStorage() {
  const gameState = {
    playerCoins,
    playerEssences,
    inventoryItems,
    shopPriceModifier,
    dialogAnswerIndexes,
    muralMissions: muralMissions.map(m => ({ id: m.id, status: m.status }))
  };
  localStorage.setItem("nippon_era_save", JSON.stringify(gameState));
  if (!firebaseDb || !currentRpgId) {
    localStorage.setItem("nippon_era_local_mural", JSON.stringify(muralMissions));
    localStorage.setItem("nippon_era_local_dossiers", JSON.stringify(characterDossiers));
  }
}

function loadGameFromLocalStorage() {
  // Carrega a lista de missões local primeiro
  const savedMural = localStorage.getItem("nippon_era_local_mural");
  if (savedMural) {
    try {
      muralMissions = JSON.parse(savedMural);
    } catch (e) {
      console.error(e);
      muralMissions = initialMissions.map(m => ({ ...m, status: "available" }));
    }
  } else {
    muralMissions = initialMissions.map(m => ({ ...m, status: "available" }));
    localStorage.setItem("nippon_era_local_mural", JSON.stringify(muralMissions));
  }

  // Carrega a lista de dossiês local
  const savedDossiers = localStorage.getItem("nippon_era_local_dossiers");
  if (savedDossiers) {
    try {
      characterDossiers = JSON.parse(savedDossiers);
    } catch (e) {
      console.error(e);
      characterDossiers = initialDossiers;
    }
  } else {
    characterDossiers = initialDossiers;
    localStorage.setItem("nippon_era_local_dossiers", JSON.stringify(characterDossiers));
  }

  const saved = localStorage.getItem("nippon_era_save");
  if (saved) {
    try {
      const gameState = JSON.parse(saved);
      playerCoins = gameState.playerCoins ?? 150;
      playerEssences = gameState.playerEssences ?? 50;
      inventoryItems = [];
      shopPriceModifier = gameState.shopPriceModifier ?? 0;
      
      // Restaura índices de respostas
      Object.assign(dialogAnswerIndexes, gameState.dialogAnswerIndexes || {});
      
      // Restaura status das missões (retrocompatibilidade)
      if (gameState.muralMissions) {
        gameState.muralMissions.forEach(savedM => {
          const mission = muralMissions.find(m => m.id === savedM.id);
          if (mission) {
            mission.status = savedM.status;
          }
        });
      }
    } catch (e) {
      console.error("Erro ao carregar o progresso salvo. Reiniciando...", e);
      initializeNewGame();
    }
  } else {
    initializeNewGame();
  }

  updateCoinsUI();
}

function initializeNewGame() {
  playerCoins = 150;
  playerEssences = 50;
  inventoryItems = [];
  shopPriceModifier = 0;
  
  // Limpa índices de diálogo
  for (const key in dialogAnswerIndexes) {
    delete dialogAnswerIndexes[key];
  }
  
  // Reseta missões para disponível
  muralMissions = initialMissions.map(m => ({
    ...m,
    status: "available"
  }));
  localStorage.setItem("nippon_era_local_mural", JSON.stringify(muralMissions));

  // Reseta dossiês
  characterDossiers = initialDossiers;
  localStorage.setItem("nippon_era_local_dossiers", JSON.stringify(characterDossiers));

  saveGameToLocalStorage();
}

// --- HUD DE COINS ---

function updateCoinsUI() {
  const shopCoins = document.querySelector("#shop-coins-value");
  const shopMagicCoins = document.querySelector("#shop-magic-coins-value");
  const inventoryCoins = document.querySelector("#inventory-coins-value");
  const inventoryMagicCoins = document.querySelector("#inventory-magic-coins-value");
  const muralCoins = document.querySelector("#mural-coins-value");
  const muralMagicCoins = document.querySelector("#mural-magic-coins-value");

  if (shopCoins) shopCoins.textContent = playerCoins;
  if (shopMagicCoins) shopMagicCoins.textContent = playerEssences;
  if (inventoryCoins) inventoryCoins.textContent = playerCoins;
  if (inventoryMagicCoins) inventoryMagicCoins.textContent = playerEssences;
  if (muralCoins) muralCoins.textContent = playerCoins;
  if (muralMagicCoins) muralMagicCoins.textContent = playerEssences;
}

// --- FIREBASE SETUP ---

function setAuthStatus(message, tone = "neutral") {
  if (!authStatus) {
    return;
  }
  authStatus.textContent = message;
  authStatus.dataset.tone = tone;
}

function hasFirebaseConfig(config) {
  return Boolean(
    config &&
      config.apiKey &&
      config.projectId &&
      !config.apiKey.includes("COLE_") &&
      !config.projectId.includes("SEU_")
  );
}

function initializeFirebaseServices() {
  const config = window.NIPPON_FIREBASE_CONFIG;

  if (!window.firebase || !hasFirebaseConfig(config)) {
    setAuthStatus("Firebase aguardando configuração em firebase-config.js.", "warning");
    return;
  }

  try {
    if (!window.firebase.apps.length) {
      window.firebase.initializeApp(config);
    }

    firebaseAuth = window.firebase.auth();
    firebaseDb = window.firebase.firestore();
    setAuthStatus("Firebase conectado. O registro de Okami está pronto.", "success");

    firebaseAuth.onAuthStateChanged(async (user) => {
      if (user) {
        currentUser = user;
        setAuthStatus(`Sessão ativa: ${user.email}.`, "success");
        try {
          const profileDoc = await firebaseDb.collection("users").doc(user.uid).get();
          currentUserProfile = profileDoc.exists
            ? profileDoc.data()
            : {
                displayName: user.displayName || user.email,
                email: user.email,
                roleDefault: "player"
              };
          await loadUserRpgContext(user, currentUserProfile.roleDefault || "player");
        } catch (error) {
          console.error(error);
          setAuthStatus("Sessão ativa, mas não consegui carregar a campanha.", "error");
        }
      } else {
        currentUser = null;
        currentUserProfile = null;
        currentRpgId = "";
        currentMemberRole = "";
        updateRoleVisibility();
      }
    });
  } catch (error) {
    console.error(error);
    setAuthStatus("Falha ao iniciar Firebase. Confira as credenciais.", "error");
  }
}

function requireFirebase() {
  if (firebaseAuth && firebaseDb) {
    return true;
  }
  setAuthStatus("Configure o Firebase antes de salvar contas ou RPGs.", "warning");
  return false;
}

function fieldValue() {
  return window.firebase.firestore.FieldValue;
}

function setCreatorStatus(message, tone = "neutral") {
  if (!creatorStatus) {
    return;
  }

  creatorStatus.textContent = message;
  creatorStatus.dataset.tone = tone;
}

function canUseCreatorPanel() {
  return creatorRoles.includes(currentMemberRole);
}

function canEditItems() {
  return itemEditorRoles.includes(currentMemberRole);
}

function canEditLore() {
  return loreEditorRoles.includes(currentMemberRole);
}

function canReadLogs() {
  return logReaderRoles.includes(currentMemberRole);
}

function updateRoleVisibility() {
  const isCreator = canUseCreatorPanel();
  document.querySelectorAll(".creator-only").forEach((element) => {
    if (element.classList.contains("inline-creator-panel")) {
      if (!isCreator) {
        element.hidden = true;
      }
    } else {
      element.hidden = !isCreator;
    }
  });
  if (!isCreator) {
    hideCreatorBackdrop();
  }
  updateActiveRoleButtons();
}

async function writeRpgLog(action, targetType, targetId, message, metadata = {}) {
  if (!firebaseDb || !currentRpgId) {
    return;
  }

  try {
    await firebaseDb.collection("rpgLogs").add({
      rpgId: currentRpgId,
      actorUid: currentUser?.uid || "",
      actorName: currentUserProfile?.displayName || currentUser?.displayName || currentUser?.email || "Sistema",
      actorRole: currentMemberRole || currentUserProfile?.roleDefault || "unknown",
      action,
      targetType,
      targetId,
      message,
      metadata,
      createdAt: fieldValue().serverTimestamp()
    });
  } catch (error) {
    console.error("Erro ao registrar log:", error);
  }
}

async function setCurrentRpgContext(rpgId, role = "player") {
  if (!firebaseDb || !rpgId) {
    currentRpgId = "";
    currentRpgName = "";
    currentMemberRole = "";
    updateRoleVisibility();
    return;
  }

  currentRpgId = rpgId;
  currentMemberRole = role;

  const rpgDoc = await firebaseDb.collection("rpgs").doc(rpgId).get();
  currentRpgName = rpgDoc.exists ? rpgDoc.data().name : "";
  setCreatorStatus(
    currentRpgName
      ? `Campanha ativa: ${currentRpgName} | papel: ${currentMemberRole || "sem papel"}`
      : "Campanha ativa não encontrada.",
    currentRpgName ? "success" : "warning"
  );

  updateRoleVisibility();
  await Promise.all([
    loadShopItemsFromDb(),
    loadPlayerInventoryFromDb(),
    loadLoreFromDb(),
    loadMissionsFromDb(),
    loadDossiersFromDb(),
    canUseCreatorPanel() ? loadCreatorDashboardData() : Promise.resolve()
  ]);
}

async function loadDossiersFromDb() {
  if (!firebaseDb || !currentRpgId) {
    return;
  }

  try {
    const snapshot = await firebaseDb
      .collection("rpgDossiers")
      .where("rpgId", "==", currentRpgId)
      .get();

    if (!snapshot.empty) {
      characterDossiers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } else {
      characterDossiers = initialDossiers;
    }
    if (currentMuralSubView === "dossiers") {
      renderDossiers();
    }
  } catch (error) {
    console.error("Erro ao carregar dossiês do banco:", error);
  }
}

async function loadMissionsFromDb() {
  if (!firebaseDb || !currentRpgId) {
    return;
  }

  try {
    const snapshot = await firebaseDb
      .collection("rpgMissions")
      .where("rpgId", "==", currentRpgId)
      .get();

    if (!snapshot.empty) {
      muralMissions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } else {
      muralMissions = initialMissions.map(m => ({ ...m, status: "available" }));
    }
    renderMural();
  } catch (error) {
    console.error("Erro ao carregar missões do banco:", error);
  }
}

async function loadUserRpgContext(user, fallbackRole = "player") {
  if (!firebaseDb || !user) {
    return;
  }

  const memberSnapshot = await firebaseDb
    .collection("rpgMembers")
    .where("uid", "==", user.uid)
    .limit(1)
    .get();

  if (!memberSnapshot.empty) {
    const memberDoc = memberSnapshot.docs[0];
    const member = memberDoc.data();
    await setCurrentRpgContext(member.rpgId, member.role || fallbackRole);
    return;
  }

  if (fallbackRole === "player") {
    const rpgSnapshot = await firebaseDb
      .collection("rpgs")
      .where("status", "==", "active")
      .limit(1)
      .get();

    if (!rpgSnapshot.empty) {
      const rpgDoc = rpgSnapshot.docs[0];
      await firebaseDb.collection("rpgMembers").doc(`${rpgDoc.id}_${user.uid}`).set(
        {
          rpgId: rpgDoc.id,
          uid: user.uid,
          role: "player",
          joinedAt: fieldValue().serverTimestamp()
        },
        { merge: true }
      );
      await setCurrentRpgContext(rpgDoc.id, "player");
      await writeRpgLog("player.joined", "rpgs", rpgDoc.id, `${user.email} entrou como jogador.`);
      return;
    }
  }

  currentRpgId = "";
  currentMemberRole = fallbackRole;
  updateRoleVisibility();
  setCreatorStatus("Nenhuma campanha vinculada a esta conta ainda.", "warning");
  await Promise.all([loadShopItemsFromDb(), loadPlayerInventoryFromDb()]);
}

function normalizeFirestoreItem(doc) {
  const data = doc.data ? doc.data() : doc;
  return {
    firestoreId: doc.id || "",
    id: data.id || doc.id || "",
    name: data.name || "Item sem nome",
    category: data.category || "Tralhas",
    rarity: data.rarity || "Comum",
    price: Number(data.price) || 1,
    damage: data.damage || "",
    defense: data.defense || "",
    healing: data.healing || "",
    durability: data.durability || "",
    extra: data.extra || "",
    description: data.description || "",
    story: data.story || "",
    npcLine: data.npcLine || (data.shopType === "magic" 
      ? "Genzo-sama ainda não proferiu sua sabedoria sobre este item." 
      : "Kisuke-san ainda não escreveu uma opinião sobre isto."),
    imageUrl: data.imageUrl || "",
    stock: Number.isFinite(Number(data.stock)) ? Number(data.stock) : -1,
    active: data.active !== false,
    shopType: data.shopType || "normal",
    createdBy: data.createdBy || "",
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null
  };
}

async function loadShopItemsFromDb() {
  if (!firebaseDb || !currentRpgId) {
    const localItems = [
      ...archivedShopItems.map(item => ({ ...item, shopType: "normal" })),
      ...archivedMagicShopItems.map(item => ({ ...item, shopType: "magic" }))
    ];
    shopItems.splice(0, shopItems.length, ...localItems);
    renderShopItems();
    return;
  }

  try {
    const snapshot = await firebaseDb
      .collection("rpgItems")
      .where("rpgId", "==", currentRpgId)
      .where("active", "==", true)
      .get();

    const items = snapshot.docs
      .map(normalizeFirestoreItem)
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

    shopItems.splice(0, shopItems.length, ...items);
    renderShopItems();
  } catch (error) {
    console.error(error);
    setAuthStatus("Não foi possível carregar a loja do banco.", "error");
  }
}

async function loadPlayerInventoryFromDb() {
  if (!firebaseDb || !currentRpgId || !currentUser) {
    inventoryItems = [];
    renderInventory();
    return;
  }

  try {
    const snapshot = await firebaseDb
      .collection("playerInventories")
      .where("rpgId", "==", currentRpgId)
      .where("playerUid", "==", currentUser.uid)
      .get();

    playerInventoryDocs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    inventoryItems = playerInventoryDocs.map((entry) => ({
      ...(entry.itemSnapshot || {}),
      id: entry.itemId,
      inventoryId: entry.id,
      quantity: entry.quantity || 1,
      acquiredAt: entry.acquiredAt || null,
      source: entry.source || "shop"
    }));
    renderInventory();
  } catch (error) {
    console.error(error);
    setAuthStatus("Não foi possível carregar o inventário do banco.", "error");
  }
}

async function loadLoreFromDb() {
  if (!firebaseDb || !currentRpgId) {
    // FALLBACK TO LOCALSTORAGE
    const saved = localStorage.getItem("nippon_era_local_lore");
    if (saved) {
      try {
        rpgLoreEntries = JSON.parse(saved);
      } catch (e) {
        console.error(e);
        rpgLoreEntries = [];
      }
    } else {
      // Prepopulate with initialLores from data/lore.js
      rpgLoreEntries = [...initialLores];
      localStorage.setItem("nippon_era_local_lore", JSON.stringify(rpgLoreEntries));
    }
    // Filter if player (draft vs published)
    if (!canEditLore()) {
      rpgLoreEntries = rpgLoreEntries.filter(entry => entry.status === "published");
    }
    rpgLoreEntries.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    renderLore();
    return;
  }

  try {
    let query = firebaseDb.collection("rpgLore").where("rpgId", "==", currentRpgId);

    if (!canEditLore()) {
      query = query.where("status", "==", "published");
    }

    const snapshot = await query.get();
    rpgLoreEntries = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    renderLore();
  } catch (error) {
    console.error(error);
    setAuthStatus("Não foi possível carregar a lore do banco.", "error");
  }
}

function renderLore() {
  if (!loreList) {
    return;
  }

  loreList.innerHTML = "";
  
  // Show static lore placeholder sections only if there are no database entries and active category is Todos
  const hasDbEntries = rpgLoreEntries.length > 0;
  document.querySelectorAll(".static-lore").forEach((section) => {
    section.hidden = hasDbEntries || activeLoreCategory !== "Todos";
  });

  if (rpgLoreEntries.length === 0) {
    return;
  }

  // Filter by category
  const filteredEntries = rpgLoreEntries.filter((entry) => {
    if (activeLoreCategory === "Todos") return true;
    const cat = entry.category || "Outros";
    if (activeLoreCategory === "Outros") {
      return ["Lugares", "Missões", "Segredos", "Outros"].includes(cat) || !["Reino", "Clãs", "Artefatos", "Personagens"].includes(cat);
    }
    return cat === activeLoreCategory;
  });

  if (filteredEntries.length === 0) {
    loreList.innerHTML = `<p class="empty-state">Nenhum registro encontrado nesta categoria.</p>`;
    return;
  }

  filteredEntries.forEach((entry) => {
    const section = document.createElement("section");
    section.className = "lore-section";

    const title = document.createElement("h3");
    title.textContent = entry.title || "Registro sem título";

    const meta = document.createElement("p");
    meta.className = "lore-meta";
    meta.textContent = `${entry.category || "Lore"}${entry.status === "draft" ? " | rascunho" : ""}`;

    const content = document.createElement("p");
    content.textContent = entry.content || "";

    section.append(title, meta, content);
    loreList.append(section);
  });
}

async function loadCreatorDashboardData() {
  await Promise.all([
    loadCreatorItems(),
    loadCreatorInventories(),
    loadCreatorLore(),
    loadCreatorLogs(),
    loadCreatorMural(),
    loadCreatorDossiers()
  ]);
}

function itemPayloadFromForm() {
  return {
    rpgId: currentRpgId,
    name: getInputValue("#item-name"),
    category: getInputValue("#item-category"),
    rarity: getInputValue("#item-rarity"),
    price: Number(getInputValue("#item-price")) || 1,
    shopType: getInputValue("#item-shop-type") || "normal",
    damage: getInputValue("#item-damage"),
    defense: getInputValue("#item-defense"),
    healing: getInputValue("#item-healing"),
    durability: getInputValue("#item-durability"),
    extra: getInputValue("#item-extra"),
    description: getInputValue("#item-description"),
    story: getInputValue("#item-story"),
    npcLine: getInputValue("#item-npc-line"),
    imageUrl: getInputValue("#item-image-url"),
    stock: Number(getInputValue("#item-stock") || -1),
    active: document.querySelector("#item-active")?.checked !== false
  };
}

function clearItemForm() {
  creatorItemForm?.reset();
  const idInput = document.querySelector("#creator-item-id");
  if (idInput) {
    idInput.value = "";
  }
  const activeInput = document.querySelector("#item-active");
  if (activeInput) {
    activeInput.checked = true;
  }
  const shopTypeSelect = document.querySelector("#item-shop-type");
  if (shopTypeSelect) {
    shopTypeSelect.value = "normal";
  }
}

function fillItemForm(item) {
  document.querySelector("#creator-item-id").value = item.firestoreId || item.id || "";
  document.querySelector("#item-name").value = item.name || "";
  document.querySelector("#item-category").value = item.category || "Tralhas";
  document.querySelector("#item-rarity").value = item.rarity || "Comum";
  document.querySelector("#item-price").value = item.price || 1;
  const shopTypeSelect = document.querySelector("#item-shop-type");
  if (shopTypeSelect) {
    shopTypeSelect.value = item.shopType || "normal";
  }
  document.querySelector("#item-damage").value = item.damage || "";
  document.querySelector("#item-defense").value = item.defense || "";
  document.querySelector("#item-healing").value = item.healing || "";
  document.querySelector("#item-durability").value = item.durability || "";
  document.querySelector("#item-extra").value = item.extra || "";
  document.querySelector("#item-stock").value = Number.isFinite(Number(item.stock)) ? item.stock : -1;
  document.querySelector("#item-image-url").value = item.imageUrl || "";
  document.querySelector("#item-description").value = item.description || "";
  document.querySelector("#item-story").value = item.story || "";
  document.querySelector("#item-npc-line").value = item.npcLine || "";
  document.querySelector("#item-active").checked = item.active !== false;
}

async function handleCreatorItemSubmit(event) {
  event.preventDefault();

  if (!requireFirebase() || !currentRpgId || !canEditItems()) {
    setCreatorStatus("Você não tem permissão para editar a loja.", "error");
    return;
  }

  const itemId = getInputValue("#creator-item-id");
  const payload = itemPayloadFromForm();

  try {
    if (itemId) {
      await firebaseDb.collection("rpgItems").doc(itemId).set(
        {
          ...payload,
          updatedAt: fieldValue().serverTimestamp()
        },
        { merge: true }
      );
      await writeRpgLog("item.updated", "rpgItems", itemId, `${currentUser.email} editou o item ${payload.name}.`, payload);
    } else {
      const docRef = await firebaseDb.collection("rpgItems").add({
        ...payload,
        createdBy: currentUser.uid,
        createdAt: fieldValue().serverTimestamp(),
        updatedAt: fieldValue().serverTimestamp()
      });
      await writeRpgLog("item.created", "rpgItems", docRef.id, `${currentUser.email} criou o item ${payload.name}.`, payload);
    }

    clearItemForm();
    setCreatorStatus("Item salvo no registro da campanha.", "success");
    await Promise.all([loadShopItemsFromDb(), loadCreatorItems(), loadCreatorLogs()]);
  } catch (error) {
    console.error(error);
    setCreatorStatus("Não foi possível salvar o item.", "error");
  }
}

async function loadCreatorItems() {
  if (!creatorItemsList) {
    return;
  }

  creatorItemsList.innerHTML = "";

  if (!firebaseDb || !currentRpgId || !canUseCreatorPanel()) {
    creatorItemsList.textContent = "Entre como criador para ver os itens.";
    return;
  }

  const snapshot = await firebaseDb
    .collection("rpgItems")
    .where("rpgId", "==", currentRpgId)
    .get();

  const items = snapshot.docs
    .map(normalizeFirestoreItem)
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  if (items.length === 0) {
    creatorItemsList.innerHTML = `<p class="empty-state">Nenhum item criado para esta campanha.</p>`;
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "creator-card";

    const title = document.createElement("h3");
    title.textContent = item.name;

    const meta = document.createElement("p");
    meta.textContent = `${item.category} | ${item.rarity} | ${item.price} moedas | ${item.active ? "ativo" : "inativo"}`;

    const actions = document.createElement("div");
    actions.className = "creator-card-actions";

    const editButton = document.createElement("button");
    editButton.className = "auth-submit auth-submit--ghost";
    editButton.type = "button";
    editButton.textContent = "Editar";
    editButton.addEventListener("click", () => fillItemForm(item));

    const disableButton = document.createElement("button");
    disableButton.className = "auth-submit auth-submit--ghost";
    disableButton.type = "button";
    disableButton.textContent = item.active ? "Desativar" : "Ativar";
    disableButton.addEventListener("click", async () => {
      if (!canEditItems()) {
        setCreatorStatus("Você não tem permissão para alterar itens.", "error");
        return;
      }

      await firebaseDb.collection("rpgItems").doc(item.firestoreId).set(
        {
          active: !item.active,
          updatedAt: fieldValue().serverTimestamp()
        },
        { merge: true }
      );
      await writeRpgLog(
        item.active ? "item.disabled" : "item.updated",
        "rpgItems",
        item.firestoreId,
        `${currentUser.email} ${item.active ? "desativou" : "ativou"} o item ${item.name}.`
      );
      await Promise.all([loadShopItemsFromDb(), loadCreatorItems(), loadCreatorLogs()]);
    });

    actions.append(editButton, disableButton);
    card.append(title, meta, actions);
    creatorItemsList.append(card);
  });
}

async function loadCreatorInventories() {
  if (!creatorInventoryList) {
    return;
  }

  creatorInventoryList.innerHTML = "";

  if (!firebaseDb || !currentRpgId || !canUseCreatorPanel()) {
    creatorInventoryList.textContent = "Entre como criador para ver inventários.";
    return;
  }

  const search = getInputValue("#inventory-search").toLowerCase();
  const snapshot = await firebaseDb
    .collection("playerInventories")
    .where("rpgId", "==", currentRpgId)
    .get();

  const entries = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((entry) => {
      const item = entry.itemSnapshot || {};
      const haystack = `${entry.playerEmail || ""} ${entry.playerName || ""} ${item.name || ""} ${item.category || ""} ${item.rarity || ""}`.toLowerCase();
      return !search || haystack.includes(search);
    });

  if (entries.length === 0) {
    creatorInventoryList.innerHTML = `<p class="empty-state">Nenhum item comprado por jogadores ainda.</p>`;
    return;
  }

  entries.forEach((entry) => {
    const item = entry.itemSnapshot || {};
    const card = document.createElement("article");
    card.className = "creator-card";

    const title = document.createElement("h3");
    title.textContent = item.name || "Item sem nome";

    const meta = document.createElement("p");
    meta.textContent = `${entry.playerName || entry.playerEmail || entry.playerUid} | ${item.category || "Sem categoria"} | qtd. ${entry.quantity || 1}`;

    const detail = document.createElement("p");
    detail.textContent = `Origem: ${entry.source || "shop"} | Preço pago: ${item.pricePaid || item.price || 0} moedas`;

    card.append(title, meta, detail);
    creatorInventoryList.append(card);
  });
}

function lorePayloadFromForm() {
  return {
    rpgId: currentRpgId,
    title: getInputValue("#lore-title"),
    category: getInputValue("#lore-category"),
    content: getInputValue("#lore-content"),
    status: getInputValue("#lore-status") || "draft",
    order: Number(getInputValue("#lore-order")) || 1
  };
}

function clearLoreForm() {
  creatorLoreForm?.reset();
  const idInput = document.querySelector("#lore-id");
  if (idInput) {
    idInput.value = "";
  }
}

function fillLoreForm(entry) {
  document.querySelector("#lore-id").value = entry.id || "";
  document.querySelector("#lore-title").value = entry.title || "";
  document.querySelector("#lore-category").value = entry.category || "Reino";
  document.querySelector("#lore-status").value = entry.status || "draft";
  document.querySelector("#lore-order").value = entry.order || 1;
  document.querySelector("#lore-content").value = entry.content || "";
}

async function handleCreatorLoreSubmit(event) {
  event.preventDefault();

  if (!canEditLore()) {
    setCreatorStatus("Você não tem permissão para editar lore.", "error");
    return;
  }

  const loreId = getInputValue("#lore-id");
  const payload = lorePayloadFromForm();

  try {
    if (!firebaseDb || !currentRpgId) {
      // Local save/create
      let localLores = [];
      const saved = localStorage.getItem("nippon_era_local_lore");
      if (saved) {
        try {
          localLores = JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }

      if (loreId) {
        // Edit
        const index = localLores.findIndex(e => e.id === loreId);
        if (index !== -1) {
          localLores[index] = {
            ...localLores[index],
            ...payload,
            updatedAt: new Date().toISOString()
          };
        }
      } else {
        // Create new
        const newLore = {
          ...payload,
          id: "local_" + Date.now(),
          createdBy: "local-creator",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        localLores.push(newLore);
      }

      localStorage.setItem("nippon_era_local_lore", JSON.stringify(localLores));
      clearLoreForm();
      setCreatorStatus("Lore salva com sucesso (local).", "success");
      await Promise.all([loadLoreFromDb(), loadCreatorLore()]);
      return;
    }

    if (loreId) {
      await firebaseDb.collection("rpgLore").doc(loreId).set(
        {
          ...payload,
          updatedAt: fieldValue().serverTimestamp()
        },
        { merge: true }
      );
      await writeRpgLog("lore.updated", "rpgLore", loreId, `${currentUser.email} editou a lore ${payload.title}.`, payload);
    } else {
      const docRef = await firebaseDb.collection("rpgLore").add({
        ...payload,
        createdBy: currentUser.uid,
        createdAt: fieldValue().serverTimestamp(),
        updatedAt: fieldValue().serverTimestamp()
      });
      await writeRpgLog("lore.created", "rpgLore", docRef.id, `${currentUser.email} criou a lore ${payload.title}.`, payload);
    }

    if (payload.status === "published") {
      await writeRpgLog("lore.published", "rpgLore", loreId || payload.title, `${currentUser.email} publicou a lore ${payload.title}.`);
    }

    clearLoreForm();
    setCreatorStatus("Lore salva no registro da campanha.", "success");
    await Promise.all([loadLoreFromDb(), loadCreatorLore(), loadCreatorLogs()]);
  } catch (error) {
    console.error(error);
    setCreatorStatus("Não foi possível salvar a lore.", "error");
  }
}

async function loadCreatorLore() {
  if (!creatorLoreList) {
    return;
  }

  creatorLoreList.innerHTML = "";

  if (!canUseCreatorPanel()) {
    creatorLoreList.textContent = "Entre como criador para ver a lore.";
    return;
  }

  let entries = [];
  try {
    if (!firebaseDb || !currentRpgId) {
      // Local fallback
      const saved = localStorage.getItem("nippon_era_local_lore");
      if (saved) {
        entries = JSON.parse(saved);
      } else {
        entries = [...initialLores];
        localStorage.setItem("nippon_era_local_lore", JSON.stringify(entries));
      }
    } else {
      const snapshot = await firebaseDb
        .collection("rpgLore")
        .where("rpgId", "==", currentRpgId)
        .get();

      entries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
  } catch (error) {
    console.error(error);
  }

  entries.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  if (entries.length === 0) {
    creatorLoreList.innerHTML = `<p class="empty-state">Nenhuma lore escrita para esta campanha.</p>`;
    return;
  }

  entries.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "creator-card";

    const title = document.createElement("h3");
    title.textContent = entry.title || "Registro sem título";

    const meta = document.createElement("p");
    meta.textContent = `${entry.category || "Lore"} | ${entry.status === "published" ? "publicado" : "rascunho"} | ordem ${entry.order || 1}`;

    const actions = document.createElement("div");
    actions.className = "creator-card-actions";

    const editButton = document.createElement("button");
    editButton.className = "auth-submit auth-submit--ghost";
    editButton.type = "button";
    editButton.textContent = "Editar";
    editButton.addEventListener("click", () => fillLoreForm(entry));

    const deleteButton = document.createElement("button");
    deleteButton.className = "auth-submit auth-submit--ghost";
    deleteButton.type = "button";
    deleteButton.textContent = "Apagar";
    deleteButton.addEventListener("click", async () => {
      if (!confirm(`Deseja realmente apagar a lore "${entry.title}"?`)) {
        return;
      }
      if (!canEditLore()) {
        setCreatorStatus("Você não tem permissão para apagar lore.", "error");
        return;
      }
      try {
        if (!firebaseDb || !currentRpgId) {
          let localLores = [];
          const saved = localStorage.getItem("nippon_era_local_lore");
          if (saved) {
            localLores = JSON.parse(saved);
          }
          localLores = localLores.filter(e => e.id !== entry.id);
          localStorage.setItem("nippon_era_local_lore", JSON.stringify(localLores));
          setCreatorStatus("Lore apagada com sucesso (local).", "success");
          await Promise.all([loadLoreFromDb(), loadCreatorLore()]);
        } else {
          await firebaseDb.collection("rpgLore").doc(entry.id).delete();
          await writeRpgLog("lore.deleted", "rpgLore", entry.id, `${currentUser.email} apagou a lore ${entry.title}.`);
          setCreatorStatus("Lore apagada com sucesso.", "success");
          await Promise.all([loadLoreFromDb(), loadCreatorLore(), loadCreatorLogs()]);
        }
      } catch (error) {
        console.error(error);
        setCreatorStatus("Não foi possível apagar a lore.", "error");
      }
    });

    actions.append(editButton, deleteButton);
    card.append(title, meta, actions);
    creatorLoreList.append(card);
  });
}

function checkMissionRequirement(mission, inventory) {
  if (typeof mission.checkRequirement === "function") {
    return mission.checkRequirement(inventory);
  }
  
  if (!mission.requiredType || mission.requiredType === "none") {
    return true;
  }
  
  if (mission.requiredType === "category") {
    return inventory.some(item => item.category === mission.requiredValue);
  }
  
  if (mission.requiredType === "item") {
    const requiredValue = mission.requiredValue || "";
    const requiredIds = typeof requiredValue === "string"
      ? requiredValue.split(",").map(s => s.trim())
      : (Array.isArray(requiredValue) ? requiredValue : []);
    
    return inventory.some(item => requiredIds.includes(item.id));
  }
  
  return true;
}

async function loadCreatorMural() {
  const creatorMuralList = document.querySelector("#creator-mural-list");
  if (!creatorMuralList) {
    return;
  }

  creatorMuralList.innerHTML = "";

  if (!canUseCreatorPanel()) {
    creatorMuralList.textContent = "Entre como criador para ver o mural.";
    return;
  }

  if (muralMissions.length === 0) {
    creatorMuralList.innerHTML = `<p class="empty-state">Nenhum contrato cadastrado no mural.</p>`;
    return;
  }

  muralMissions.forEach((mission) => {
    const card = document.createElement("article");
    card.className = "creator-card";

    const title = document.createElement("h3");
    title.textContent = mission.title || "Contrato sem título";

    const meta = document.createElement("p");
    const statusText = mission.status === "completed" ? "concluído" : (mission.status === "accepted" ? "aceito" : "disponível");
    meta.textContent = `${mission.difficulty || "Moderada"} | ${mission.timeEstimate || "uma noite"} | 🪙 ${mission.reward} moedas | ${statusText}`;

    const actions = document.createElement("div");
    actions.className = "creator-card-actions";

    const editButton = document.createElement("button");
    editButton.className = "auth-submit auth-submit--ghost";
    editButton.type = "button";
    editButton.textContent = "Editar";
    editButton.addEventListener("click", () => fillMuralForm(mission));

    const deleteButton = document.createElement("button");
    deleteButton.className = "auth-submit auth-submit--ghost";
    deleteButton.type = "button";
    deleteButton.textContent = "Apagar";
    deleteButton.addEventListener("click", async () => {
      if (!confirm(`Deseja realmente apagar o contrato "${mission.title}"?`)) {
        return;
      }
      if (!canUseCreatorPanel()) {
        setCreatorStatus("Você não tem permissão para apagar contratos.", "error");
        return;
      }
      try {
        if (!firebaseDb || !currentRpgId) {
          muralMissions = muralMissions.filter(m => m.id !== mission.id);
          localStorage.setItem("nippon_era_local_mural", JSON.stringify(muralMissions));
          setCreatorStatus("Contrato apagado com sucesso (local).", "success");
          await Promise.all([renderMural(), loadCreatorMural()]);
        } else {
          await firebaseDb.collection("rpgMissions").doc(mission.id).delete();
          await writeRpgLog("mission.deleted", "rpgMissions", mission.id, `${currentUser.email} apagou o contrato ${mission.title}.`);
          setCreatorStatus("Contrato apagado com sucesso do banco.", "success");
          muralMissions = muralMissions.filter(m => m.id !== mission.id);
          await Promise.all([renderMural(), loadCreatorMural(), loadCreatorLogs()]);
        }
      } catch (error) {
        console.error(error);
        setCreatorStatus("Não foi possível apagar o contrato.", "error");
      }
    });

    actions.append(editButton, deleteButton);
    card.append(title, meta, actions);
    creatorMuralList.append(card);
  });
}

function fillMuralForm(mission) {
  document.querySelector("#mission-id").value = mission.id || "";
  document.querySelector("#mission-title").value = mission.title || "";
  document.querySelector("#mission-difficulty").value = mission.difficulty || "Moderada";
  document.querySelector("#mission-time").value = mission.timeEstimate || "";
  document.querySelector("#mission-reward").value = mission.reward || 100;
  document.querySelector("#mission-reputation").value = mission.reputationReward || "0";
  document.querySelector("#mission-req-type").value = mission.requiredType || "none";
  document.querySelector("#mission-req-value").value = mission.requiredValue || "";
  document.querySelector("#mission-req-text").value = mission.requirementText || "";
  document.querySelector("#mission-consume").checked = mission.consumeItem !== false && mission.consumeItem !== "false";
  document.querySelector("#mission-desc").value = mission.description || "";
}

function clearMuralForm() {
  document.querySelector("#creator-mural-form")?.reset();
  const idInput = document.querySelector("#mission-id");
  if (idInput) {
    idInput.value = "";
  }
}

async function handleCreatorMuralSubmit(event) {
  event.preventDefault();

  if (!canUseCreatorPanel()) {
    setCreatorStatus("Você não tem permissão para editar o mural.", "error");
    return;
  }

  const id = getInputValue("#mission-id");
  const payload = {
    title: getInputValue("#mission-title"),
    difficulty: getInputValue("#mission-difficulty"),
    timeEstimate: getInputValue("#mission-time"),
    reward: Number(getInputValue("#mission-reward")) || 100,
    reputationReward: Number(getInputValue("#mission-reputation")) || 0,
    requiredType: getInputValue("#mission-req-type"),
    requiredValue: getInputValue("#mission-req-value"),
    requirementText: getInputValue("#mission-req-text"),
    consumeItem: document.querySelector("#mission-consume")?.checked ? true : false,
    description: getInputValue("#mission-desc"),
    status: "available"
  };

  try {
    if (!firebaseDb || !currentRpgId) {
      // Local save
      if (id) {
        // Edit
        const index = muralMissions.findIndex(m => m.id === id);
        if (index !== -1) {
          muralMissions[index] = {
            ...muralMissions[index],
            ...payload,
            status: muralMissions[index].status || "available"
          };
        }
      } else {
        // Create
        const newMission = {
          ...payload,
          id: "mission_" + Date.now()
        };
        muralMissions.push(newMission);
      }
      localStorage.setItem("nippon_era_local_mural", JSON.stringify(muralMissions));
      clearMuralForm();
      setCreatorStatus("Contrato salvo no mural (local).", "success");
      await Promise.all([renderMural(), loadCreatorMural()]);
      return;
    }

    // Firebase mode
    if (id) {
      await firebaseDb.collection("rpgMissions").doc(id).set(
        {
          ...payload,
          rpgId: currentRpgId,
          updatedAt: fieldValue().serverTimestamp()
        },
        { merge: true }
      );
      await writeRpgLog("mission.updated", "rpgMissions", id, `${currentUser.email} editou o contrato ${payload.title}.`, payload);
    } else {
      const docRef = await firebaseDb.collection("rpgMissions").add({
        ...payload,
        rpgId: currentRpgId,
        createdBy: currentUser.uid,
        createdAt: fieldValue().serverTimestamp(),
        updatedAt: fieldValue().serverTimestamp()
      });
      await writeRpgLog("mission.created", "rpgMissions", docRef.id, `${currentUser.email} criou o contrato ${payload.title}.`, payload);
    }

    // Refresh memory missions from DB
    const snapshot = await firebaseDb.collection("rpgMissions").where("rpgId", "==", currentRpgId).get();
    muralMissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    clearMuralForm();
    setCreatorStatus("Contrato salvo no mural da campanha.", "success");
    await Promise.all([renderMural(), loadCreatorMural(), loadCreatorLogs()]);
  } catch (error) {
    console.error(error);
    setCreatorStatus("Não foi possível salvar o contrato.", "error");
  }
}

async function loadCreatorDossiers() {
  const creatorDossiersList = document.querySelector("#creator-dossiers-list");
  if (!creatorDossiersList) return;

  creatorDossiersList.innerHTML = "";

  if (!canUseCreatorPanel()) {
    creatorDossiersList.textContent = "Entre como criador para ver a oficina de dossiês.";
    return;
  }

  if (characterDossiers.length === 0) {
    creatorDossiersList.innerHTML = `<p class="empty-state">Nenhum dossiê cadastrado.</p>`;
    return;
  }

  characterDossiers.forEach((dossier) => {
    const card = document.createElement("article");
    card.className = "creator-card";

    const title = document.createElement("h3");
    title.textContent = dossier.name || "Dossiê sem nome";

    const meta = document.createElement("p");
    meta.textContent = `${dossier.title || "Sem título"} | ${dossier.faction || "Sem facção"} | status: ${dossier.approval}`;

    const actions = document.createElement("div");
    actions.className = "creator-card-actions";

    const editButton = document.createElement("button");
    editButton.className = "auth-submit auth-submit--ghost";
    editButton.type = "button";
    editButton.textContent = "Editar";
    editButton.addEventListener("click", () => fillDossierForm(dossier));

    const deleteButton = document.createElement("button");
    deleteButton.className = "auth-submit auth-submit--ghost";
    deleteButton.type = "button";
    deleteButton.textContent = "Apagar";
    deleteButton.addEventListener("click", async () => {
      if (!confirm(`Deseja realmente apagar o dossiê de "${dossier.name}"?`)) {
        return;
      }
      if (!canUseCreatorPanel()) {
        setCreatorStatus("Você não tem permissão para apagar dossiês.", "error");
        return;
      }
      try {
        if (!firebaseDb || !currentRpgId) {
          characterDossiers = characterDossiers.filter(d => d.id !== dossier.id);
          localStorage.setItem("nippon_era_local_dossiers", JSON.stringify(characterDossiers));
          setCreatorStatus("Dossiê apagado com sucesso (local).", "success");
          await Promise.all([renderDossiers(), loadCreatorDossiers()]);
        } else {
          await firebaseDb.collection("rpgDossiers").doc(dossier.id).delete();
          await writeRpgLog("dossier.deleted", "rpgDossiers", dossier.id, `${currentUser.email} apagou o dossiê de ${dossier.name}.`);
          setCreatorStatus("Dossiê apagado com sucesso do banco.", "success");
          characterDossiers = characterDossiers.filter(d => d.id !== dossier.id);
          await Promise.all([renderDossiers(), loadCreatorDossiers(), loadCreatorLogs()]);
        }
      } catch (error) {
        console.error(error);
        setCreatorStatus("Não foi possível apagar o dossiê.", "error");
      }
    });

    actions.append(editButton, deleteButton);
    card.append(title, meta, actions);
    creatorDossiersList.append(card);
  });
}

function fillDossierForm(dossier) {
  document.querySelector("#dossier-id").value = dossier.id || "";
  document.querySelector("#dossier-name").value = dossier.name || "";
  document.querySelector("#dossier-title").value = dossier.title || "";
  document.querySelector("#dossier-faction").value = dossier.faction || "";
  document.querySelector("#dossier-status").value = dossier.status || "";
  document.querySelector("#dossier-traits").value = dossier.traits || "";
  document.querySelector("#dossier-relationship").value = dossier.relationship || "";
  document.querySelector("#dossier-approval").value = dossier.approval || "aprovada";
  
  const avatarVal = dossier.avatarUrl || "assets/img/NPC1.png";
  document.querySelector("#dossier-avatar").value = avatarVal;
  const preview = document.querySelector("#dossier-avatar-preview");
  if (preview) {
    preview.src = avatarVal;
  }
  
  document.querySelector("#dossier-secrets").value = dossier.secrets || "";
  document.querySelector("#dossier-biography").value = dossier.biography || "";

  // Abre automaticamente a seção avançada ao editar
  const detailsSec = document.querySelector(".advanced-details-section");
  if (detailsSec) {
    detailsSec.open = true;
  }
}

function clearDossierForm() {
  document.querySelector("#creator-dossiers-form")?.reset();
  const idInput = document.querySelector("#dossier-id");
  if (idInput) {
    idInput.value = "";
  }
  const preview = document.querySelector("#dossier-avatar-preview");
  if (preview) {
    preview.src = "assets/img/NPC1.png";
  }
  const detailsSec = document.querySelector(".advanced-details-section");
  if (detailsSec) {
    detailsSec.open = false;
  }
}

async function handleCreatorDossierSubmit(event) {
  event.preventDefault();

  if (!canUseCreatorPanel()) {
    setCreatorStatus("Você não tem permissão para gerenciar dossiês.", "error");
    return;
  }

  const id = getInputValue("#dossier-id");
  const payload = {
    name: getInputValue("#dossier-name"),
    title: getInputValue("#dossier-title"),
    faction: getInputValue("#dossier-faction"),
    status: getInputValue("#dossier-status"),
    traits: getInputValue("#dossier-traits"),
    relationship: getInputValue("#dossier-relationship"),
    approval: getInputValue("#dossier-approval"),
    avatarUrl: getInputValue("#dossier-avatar") || "assets/img/NPC1.png",
    secrets: getInputValue("#dossier-secrets"),
    biography: getInputValue("#dossier-biography")
  };

  try {
    if (!firebaseDb || !currentRpgId) {
      // Local mode
      if (id) {
        const index = characterDossiers.findIndex(d => d.id === id);
        if (index !== -1) {
          characterDossiers[index] = {
            ...characterDossiers[index],
            ...payload
          };
        }
      } else {
        const newDossier = {
          ...payload,
          id: "dossier_" + Date.now()
        };
        characterDossiers.push(newDossier);
      }
      localStorage.setItem("nippon_era_local_dossiers", JSON.stringify(characterDossiers));
      clearDossierForm();
      setCreatorStatus("Dossiê salvo com sucesso (local).", "success");
      await Promise.all([renderDossiers(), loadCreatorDossiers()]);
      return;
    }

    // Firebase mode
    if (id) {
      await firebaseDb.collection("rpgDossiers").doc(id).set(
        {
          ...payload,
          rpgId: currentRpgId,
          updatedAt: fieldValue().serverTimestamp()
        },
        { merge: true }
      );
      await writeRpgLog("dossier.updated", "rpgDossiers", id, `${currentUser.email} editou o dossiê de ${payload.name}.`, payload);
    } else {
      const docRef = await firebaseDb.collection("rpgDossiers").add({
        ...payload,
        rpgId: currentRpgId,
        createdBy: currentUser.uid,
        createdAt: fieldValue().serverTimestamp(),
        updatedAt: fieldValue().serverTimestamp()
      });
      await writeRpgLog("dossier.created", "rpgDossiers", docRef.id, `${currentUser.email} criou o dossiê de ${payload.name}.`, payload);
    }

    // Reload from Firestore
    await loadDossiersFromDb();
    clearDossierForm();
    setCreatorStatus("Dossiê salvo no banco da campanha.", "success");
    await Promise.all([renderDossiers(), loadCreatorDossiers(), loadCreatorLogs()]);
  } catch (error) {
    console.error(error);
    setCreatorStatus("Não foi possível salvar o dossiê.", "error");
  }
}

async function loadCreatorLogs() {
  if (!creatorLogList) {
    return;
  }

  creatorLogList.innerHTML = "";

  if (!firebaseDb || !currentRpgId || !canReadLogs()) {
    creatorLogList.textContent = "Sem permissão para ler logs.";
    return;
  }

  const snapshot = await firebaseDb
    .collection("rpgLogs")
    .where("rpgId", "==", currentRpgId)
    .limit(60)
    .get();

  const entries = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => {
      const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return bTime - aTime;
    });

  if (entries.length === 0) {
    creatorLogList.innerHTML = `<p class="empty-state">Nenhum log registrado ainda.</p>`;
    return;
  }

  entries.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "creator-card log-card";

    const title = document.createElement("h3");
    title.textContent = entry.action || "log";

    const message = document.createElement("p");
    message.textContent = entry.message || "Registro sem mensagem.";

    const meta = document.createElement("p");
    meta.textContent = `${entry.actorName || "Sistema"} | ${entry.actorRole || "sem papel"}`;

    card.append(title, message, meta);
    creatorLogList.append(card);
  });
}

function getInputValue(selector) {
  return document.querySelector(selector)?.value.trim() || "";
}

async function hashCreatorKey(key) {
  const bytes = new TextEncoder().encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function upsertUserProfile(user, profile) {
  await firebaseDb.collection("users").doc(user.uid).set(
    {
      uid: user.uid,
      email: user.email,
      displayName: profile.displayName || user.email,
      roleDefault: profile.roleDefault,
      updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );
}

async function handlePlayerAuth(event) {
  event.preventDefault();

  if (!requireFirebase()) {
    return;
  }

  const displayName = getInputValue("#player-name") || "Viajante sem brasão";
  const email = getInputValue("#player-email");
  const password = getInputValue("#player-password");

  try {
    const credential =
      lastPlayerAuthAction === "player-create"
        ? await firebaseAuth.createUserWithEmailAndPassword(email, password)
        : await firebaseAuth.signInWithEmailAndPassword(email, password);

    if (lastPlayerAuthAction === "player-create") {
      await credential.user.updateProfile({ displayName });
    }

    await upsertUserProfile(credential.user, {
      displayName,
      roleDefault: "player"
    });

    currentUser = credential.user;
    currentUserProfile = {
      displayName,
      email: credential.user.email,
      roleDefault: "player"
    };
    await loadUserRpgContext(credential.user, "player");
    await writeRpgLog("player.joined", "users", credential.user.uid, `${displayName} entrou como jogador.`);
    setAuthStatus("Jogador registrado. Os portões foram abertos.", "success");
    openScreen("menu");
  } catch (error) {
    console.error(error);
    setAuthStatus(error.message || "Não foi possível autenticar o jogador.", "error");
  }
}

async function handleCreatorLogin(event) {
  event.preventDefault();

  if (!requireFirebase()) {
    return;
  }

  const email = getInputValue("#creator-email");
  const password = getInputValue("#creator-password");
  const creatorKey = getInputValue("#creator-key");

  try {
    const credential = await firebaseAuth.signInWithEmailAndPassword(email, password);
    const creatorKeyHash = await hashCreatorKey(creatorKey);
    const rpgSnapshot = await firebaseDb
      .collection("rpgs")
      .where("creatorKeyHash", "==", creatorKeyHash)
      .where("status", "==", "active")
      .limit(1)
      .get();

    if (rpgSnapshot.empty) {
      setAuthStatus("Chave dos criadores não encontrada para nenhum RPG ativo.", "error");
      return;
    }

    const rpgDoc = rpgSnapshot.docs[0];
    currentUser = credential.user;
    currentUserProfile = {
      displayName: credential.user.displayName || credential.user.email,
      email: credential.user.email,
      roleDefault: "creator"
    };
    await upsertUserProfile(credential.user, {
      displayName: credential.user.displayName || credential.user.email,
      roleDefault: "creator"
    });
    await firebaseDb.collection("rpgMembers").doc(`${rpgDoc.id}_${credential.user.uid}`).set(
      {
        rpgId: rpgDoc.id,
        uid: credential.user.uid,
        role: "creator",
        joinedAt: window.firebase.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    await setCurrentRpgContext(rpgDoc.id, "creator");
    await writeRpgLog("creator.joined", "rpgs", rpgDoc.id, `${credential.user.email} entrou usando a chave dos criadores.`);
    setAuthStatus(`Criador autorizado em ${rpgDoc.data().name}.`, "success");
    openScreen("menu");
  } catch (error) {
    console.error(error);
    setAuthStatus(error.message || "Não foi possível autenticar o criador.", "error");
  }
}

async function handleCreateRpg(event) {
  event.preventDefault();

  if (!requireFirebase()) {
    return;
  }

  const rpgName = getInputValue("#rpg-name");
  const ownerName = getInputValue("#owner-name");
  const ownerEmail = getInputValue("#owner-email");
  const ownerPassword = getInputValue("#owner-password");
  const ownerPasswordConfirm = getInputValue("#owner-password-confirm");
  const creatorKey = getInputValue("#rpg-creator-key");

  if (ownerPassword !== ownerPasswordConfirm) {
    setAuthStatus("As senhas do criador principal não coincidem.", "error");
    return;
  }

  try {
    const credential = await firebaseAuth.createUserWithEmailAndPassword(ownerEmail, ownerPassword);
    const user = credential.user;
    const creatorKeyHash = await hashCreatorKey(creatorKey);

    await user.updateProfile({ displayName: ownerName });
    await upsertUserProfile(user, {
      displayName: ownerName,
      roleDefault: "owner"
    });

    const rpgRef = await firebaseDb.collection("rpgs").add({
      name: rpgName,
      ownerUid: user.uid,
      creatorKeyHash,
      createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
      status: "active",
      settings: {
        world: "",
        itemsReady: false,
        loreReady: false,
        missionsReady: false
      }
    });

    await firebaseDb.collection("rpgMembers").doc(`${rpgRef.id}_${user.uid}`).set({
      rpgId: rpgRef.id,
      uid: user.uid,
      role: "owner",
      joinedAt: window.firebase.firestore.FieldValue.serverTimestamp()
    });

    currentUser = user;
    currentUserProfile = {
      displayName: ownerName,
      email: user.email,
      roleDefault: "owner"
    };
    await setCurrentRpgContext(rpgRef.id, "owner");
    await writeRpgLog("rpg.created", "rpgs", rpgRef.id, `${ownerName} fundou o RPG ${rpgName}.`);
    setAuthStatus(`RPG "${rpgName}" fundado. Chave registrada com hash.`, "success");
    openScreen("menu");
  } catch (error) {
    console.error(error);
    setAuthStatus(error.message || "Não foi possível criar o RPG.", "error");
  }
}

// --- LOGICA DE DIALOGO E ESTADOS DO NPC ---

function getRotateAnswer(key, answers) {
  const currentIndex = dialogAnswerIndexes[key] || 0;
  dialogAnswerIndexes[key] = (currentIndex + 1) % answers.length;
  return answers[currentIndex];
}

function getNextDefaultLine() {
  const lines = activeShop === "magic" ? defaultMagicNpcLines : defaultNpcLines;
  const line = lines[defaultLineIndex % lines.length];
  defaultLineIndex = (defaultLineIndex + 1) % lines.length;
  defaultNpcLine = line;
  return line;
}

function getNextIdleLine() {
  const lines = activeShop === "magic" ? idleMagicNpcLines : idleNpcLines;
  const line = lines[idleLineIndex % lines.length];
  idleLineIndex = (idleLineIndex + 1) % lines.length;
  return line;
}

function getNextHoverLine() {
  const lines = activeShop === "magic" ? magicNpcHoverLines : npcHoverLines;
  const line = lines[hoverLineIndex % lines.length];
  hoverLineIndex = (hoverLineIndex + 1) % lines.length;
  return line;
}

function getNextIntroLine() {
  const lines = activeShop === "magic" ? magicDialogIntroLines : dialogIntroLines;
  const line = lines[introLineIndex % lines.length];
  introLineIndex = (introLineIndex + 1) % lines.length;
  return line;
}

function getNextDialogAnswer(option) {
  const answers = option.answers || ["..."];
  const currentIndex = dialogAnswerIndexes[option.label] || 0;
  dialogAnswerIndexes[option.label] = (currentIndex + 1) % answers.length;
  return answers[currentIndex];
}

function getAdjustedPrice(item) {
  if (item.inventoryId) {
    return item.price;
  }
  return Math.max(1, Math.round(item.price * (1 + shopPriceModifier)));
}

function getPriceMoodText() {
  const npcName = activeShop === "magic" ? "Genzo-sama" : "Kisuke-san";
  if (shopPriceModifier <= -0.12) {
    return ` ${npcName} está generoso hoje.`;
  }
  if (shopPriceModifier <= -0.04) {
    return " Os preços baixaram um pouco.";
  }
  if (shopPriceModifier >= 0.12) {
    return ` ${npcName} está cobrando caro pela sua curiosidade.`;
  }
  if (shopPriceModifier >= 0.04) {
    return " Os preços subiram um pouco.";
  }
  return " Os preços estão estáveis.";
}

function getPriceStatusText() {
  if (shopPriceModifier <= -0.12) {
    return "preços: generosos";
  }
  if (shopPriceModifier <= -0.04) {
    return "preços: reduzidos";
  }
  if (shopPriceModifier >= 0.12) {
    return "preços: severos";
  }
  if (shopPriceModifier >= 0.04) {
    return "preços: altos";
  }
  return "preços: estáveis";
}

function getNpcHumorText() {
  if (shopPriceModifier <= -0.15) {
    return "satisfeito";
  }
  if (shopPriceModifier <= -0.04) {
    return "amigável";
  }
  if (shopPriceModifier >= 0.20) {
    return "hostil";
  }
  if (shopPriceModifier >= 0.04) {
    return "irritado";
  }
  return "cauteloso";
}

function updateChatStatus() {
  if (!chatStatus) {
    return;
  }
  const talkState = isTalkingToNpc ? "conversa ativa" : "conversa em espera";
  chatStatus.textContent = `humor: ${getNpcHumorText()} | ${getPriceStatusText()} | ${talkState}`;
}

function setChatHistory(text) {
  if (!chatHistory || !text) {
    return;
  }
  chatHistory.textContent = `Histórico: ${text}`;
}

function applyPriceEffect(effect = 0) {
  shopPriceModifier = Math.max(-0.25, Math.min(0.3, shopPriceModifier + effect));
  saveGameToLocalStorage();
  updateChatStatus();
  renderShopItems();
}

function syncChatPortrait(mode = "talk") {
  if (!chatPortrait) {
    return;
  }
  chatPortrait.src = npcImages[mode] || npcImages.talk;
}

function scrollChatToBottom() {
  if (!chatLog) {
    return;
  }
  chatLog.scrollTop = chatLog.scrollHeight;
}

function pruneChatMessages() {
  if (!chatLog) {
    return;
  }
  while (chatLog.children.length > maxVisibleChatMessages) {
    chatLog.firstElementChild?.remove();
  }
}

function appendChatMessage(speaker, text, options = {}) {
  if (!chatLog) {
    return null;
  }

  const message = document.createElement("p");
  message.className = `chat-message chat-message--${speaker}`;

  const prefix = speaker === "npc" 
    ? (activeShop === "magic" ? "* Genzo-sama: " : "* Kisuke-san: ") 
    : "* Você: ";
  message.textContent = options.instant ? `${prefix}${text}` : prefix;
  chatLog.append(message);
  pruneChatMessages();
  scrollChatToBottom();

  if (options.instant) {
    setChatHistory(`${speaker === "npc" ? (activeShop === "magic" ? "Genzo-sama" : "Kisuke-san") : "Você"} disse: ${text}`);
    return message;
  }

  let characterIndex = 0;
  window.clearInterval(npcTypingTimer);
  npcTypingTimer = window.setInterval(() => {
    message.textContent = `${prefix}${text.slice(0, characterIndex + 1)}`;
    characterIndex += 1;
    scrollChatToBottom();

    if (characterIndex >= text.length) {
      window.clearInterval(npcTypingTimer);
      pruneChatMessages();
      setChatHistory(`${speaker === "npc" ? (activeShop === "magic" ? "Genzo-sama" : "Kisuke-san") : "Você"} disse: ${text}`);

      if (options.onComplete) {
        options.onComplete();
      }
    }
  }, 18);

  return message;
}

function resetNpcIdleTimer() {
  window.clearTimeout(npcIdleTimer);

  if (isTalkingToNpc) {
    return;
  }

  npcIdleTimer = window.setTimeout(() => {
    if (isTalkingToNpc || isHoveringItem || isHoveringNpc) {
      resetNpcIdleTimer();
      return;
    }
    speakNpcLine(getNextIdleLine(), { hideAfter: 5200 });
  }, 9000);
}

function hideNpcDialogAfter(delay = 4200) {
  window.clearTimeout(npcHideTimer);
  npcDialog.classList.remove("is-hidden");
}

function typeNpcLine(line, onComplete) {
  window.clearTimeout(npcHideTimer);
  if (npcDialog) {
    npcDialog.classList.remove("is-hidden");
    npcDialog.textContent = line;
  }

  syncChatPortrait("talk");
  appendChatMessage("npc", line, { onComplete });
}

function speakNpcLine(line, options = {}) {
  window.clearTimeout(npcHideTimer);
  typeNpcLine(line, () => {
    if (options.onComplete) {
      options.onComplete();
    }
  });
  resetNpcIdleTimer();
}

function closeNpcConversation() {
  isTalkingToNpc = false;
  currentDialogNode = "main";
  if (chatOptions) {
    chatOptions.innerHTML = "";
  }
  speakNpcLine(getNextDefaultLine());
  updateNpcState();
  updateChatStatus();
}

function renderNpcConversation() {
  if (!chatOptions) {
    return;
  }

  chatOptions.innerHTML = "";
  const activeTree = activeShop === "magic" ? dialogTreeMagic : dialogTree;
  const node = activeTree[currentDialogNode] || activeTree["main"];

  if (node.npcQuestion) {
    speakNpcLine(node.npcQuestion);
  }

  node.options.slice(0, 4).forEach((option) => {
    const button = document.createElement("button");
    button.className = "dialog-choice";
    button.type = "button";
    button.textContent = option.label;
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      appendChatMessage("player", option.label, { instant: true });
      setChatHistory(`Você escolheu "${option.label}".`);
      chatOptions.innerHTML = "";
      applyPriceEffect(option.priceEffect || 0);

      const answer = getNextDialogAnswer(option);
      const priceText = option.priceEffect ? getPriceMoodText() : "";

      speakNpcLine(`${answer}${priceText}`, {
        onComplete: () => {
          if (option.close) {
            window.setTimeout(closeNpcConversation, 450);
            return;
          }
          currentDialogNode = option.next || "main";
          renderNpcConversation();
        }
      });
    });

    chatOptions.append(button);
  });
}

function startNpcConversation() {
  if (isTalkingToNpc) {
    speakNpcLine("Ainda estou aqui. Escolha uma pergunta, viajante.", {
      onComplete: renderNpcConversation
    });
    updateNpcState();
    updateChatStatus();
    return;
  }

  isTalkingToNpc = true;
  currentDialogNode = "main";
  speakNpcLine(getNextIntroLine(), { onComplete: renderNpcConversation });
  updateNpcState();
  updateChatStatus();
}

// --- RENDERIZAÇÃO DE ITENS E INVENTÁRIO ---

function getItemStats(item) {
  return [
    ["Raridade", item.rarity],
    ["Categoria", item.category],
    ["Valor", `${getAdjustedPrice(item)} moedas`],
    ["Dano", item.damage],
    ["Defesa", item.defense],
    ["Cura", item.healing],
    ["Dureza", item.durability],
    ["Extra", item.extra]
  ].filter((detail) => detail[1]);
}

function createItemDetails(item, includeInventoryActions = false) {
  const details = document.createElement("div");
  details.className = "item-details";

  const detailGrid = document.createElement("div");
  detailGrid.className = "detail-grid";

  getItemStats(item).forEach(([label, value]) => {
    const pill = document.createElement("div");
    pill.className = "detail-pill";
    pill.textContent = `${label}: ${value}`;
    detailGrid.append(pill);
  });

  const story = document.createElement("p");
  story.className = "detail-story";
  story.textContent = item.story;

  details.append(detailGrid, story);

  if (includeInventoryActions) {
    const actions = document.createElement("div");
    actions.className = "inventory-actions";

    const sellButton = document.createElement("button");
    sellButton.className = "inventory-action";
    sellButton.type = "button";
    
    // Mostra o valor que o jogador vai receber de volta (70% do preço ajustado)
    const refundCoins = Math.max(1, Math.round(getAdjustedPrice(item) * 0.7));
    const isMagicItem = item.shopType === "magic";
    const currencyIcon = isMagicItem ? "🔮" : "🪙";
    sellButton.textContent = `Vender (+${refundCoins}${currencyIcon})`;
    
    sellButton.addEventListener("click", async (event) => {
      event.stopPropagation();
      const currencyName = isMagicItem ? "essências" : "moedas";
      console.log(`Item vendido: ${item.name} por ${refundCoins} ${currencyName}`);
      
      if (isMagicItem) {
        playerEssences += refundCoins;
      } else {
        playerCoins += refundCoins;
      }

      if (firebaseDb && item.inventoryId) {
        try {
          await firebaseDb.collection("playerInventories").doc(item.inventoryId).delete();
          await writeRpgLog("inventory.updated", "playerInventories", item.inventoryId, `${currentUser?.email || "Jogador"} vendeu ${item.name}.`, {
            refundCoins,
            currency: currencyName
          });
          await loadPlayerInventoryFromDb();
          if (canUseCreatorPanel()) {
            await loadCreatorInventories();
          }
        } catch (error) {
          console.error(error);
          if (isMagicItem) {
            playerEssences -= refundCoins;
          } else {
            playerCoins -= refundCoins;
          }
          speakNpcLine("A venda falhou no registro da campanha.", { hideAfter: 3500 });
          return;
        }
      } else {
        inventoryItems = inventoryItems.filter(
          (inventoryItem) => inventoryItem.inventoryId !== item.inventoryId
        );
        renderInventory();
      }
      
      openInventoryItemId = "";
      saveGameToLocalStorage();
      updateCoinsUI();
      speakNpcLine(`Obrigado pelo negócio! Aceito a ${item.name} de volta com prazer.`, { hideAfter: 3500 });
    });

    const removeButton = document.createElement("button");
    removeButton.className = "inventory-action";
    removeButton.type = "button";
    removeButton.textContent = "Tirar";
    removeButton.addEventListener("click", async (event) => {
      event.stopPropagation();
      console.log(`Item removido: ${item.name}`);
      
      if (firebaseDb && item.inventoryId) {
        try {
          await firebaseDb.collection("playerInventories").doc(item.inventoryId).delete();
          await writeRpgLog("inventory.updated", "playerInventories", item.inventoryId, `${currentUser?.email || "Jogador"} descartou ${item.name}.`);
          await loadPlayerInventoryFromDb();
          if (canUseCreatorPanel()) {
            await loadCreatorInventories();
          }
        } catch (error) {
          console.error(error);
          speakNpcLine("Não consegui alterar o inventário no registro da campanha.", { hideAfter: 3500 });
          return;
        }
      } else {
        inventoryItems = inventoryItems.filter(
          (inventoryItem) => inventoryItem.inventoryId !== item.inventoryId
        );
        renderInventory();
      }
      
      openInventoryItemId = "";
      saveGameToLocalStorage();
      speakNpcLine(`Descartou a ${item.name}? Que desperdício...`, { hideAfter: 3500 });
    });

    actions.append(sellButton, removeButton);
    details.append(actions);
  }

  return details;
}

function renderShopItems() {
  const searchTerm = shopSearch.value.trim().toLowerCase();
  const visibleItems = shopItems.filter((item) => {
    // Normaliza comparação por causa dos acentos
    const matchesCategory = activeCategory === "Todos" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm);
    const matchesShop = activeShop === "magic" ? item.shopType === "magic" : (!item.shopType || item.shopType === "normal");
    return matchesCategory && matchesSearch && matchesShop;
  });

  shopList.innerHTML = "";

  if (shopItems.filter(item => activeShop === "magic" ? item.shopType === "magic" : (!item.shopType || item.shopType === "normal")).length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "As prateleiras aguardam o primeiro carregamento.";
    shopList.append(emptyState);
    return;
  }

  if (visibleItems.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "Nenhum item encontrado nas prateleiras.";
    shopList.append(emptyState);
    return;
  }

  visibleItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = "shop-item";
    if (item.rarity) {
      card.classList.add(`rarity-${item.rarity.toLowerCase().replace("é", "e").replace("á", "a")}`);
    }
    card.classList.toggle("is-open", openShopItemId === item.id);
    card.tabIndex = 0;

    const info = document.createElement("div");
    const title = document.createElement("h2");
    const meta = document.createElement("p");
    const description = document.createElement("p");

    title.textContent = item.name;
    meta.className = "item-meta";
    meta.textContent = `${item.category} | ${item.rarity}`;
    description.textContent = item.description;

    info.append(title, meta, description);

    const buyArea = document.createElement("div");
    buyArea.className = "item-buy";

    const price = document.createElement("strong");
    price.className = "price";
    const adjustedPrice = getAdjustedPrice(item);
    price.textContent = activeShop === "magic" ? `${adjustedPrice} essências` : `${adjustedPrice} moedas`;

    const buyButton = document.createElement("button");
    buyButton.className = "buy-button";
    buyButton.type = "button";
    buyButton.textContent = "Comprar";
    
    // Desabilita visualmente se o jogador não tiver saldo suficiente
    const playerBalance = activeShop === "magic" ? playerEssences : playerCoins;
    if (playerBalance < adjustedPrice) {
      buyButton.classList.add("is-disabled");
    }

    if (item.stock === 0) {
      buyButton.classList.add("is-disabled");
      buyButton.textContent = "Esgotado";
    }

    buyButton.addEventListener("click", async (event) => {
      event.stopPropagation();
      console.log(`Item comprado: ${item.name}`);

      if (item.stock === 0) {
        speakNpcLine("Esse item acabou. Até as melhores prateleiras ficam vazias.", { hideAfter: 3500 });
        return;
      }

      // Validação de moedas
      const currencyName = activeShop === "magic" ? "essências" : "moedas";
      const balance = activeShop === "magic" ? playerEssences : playerCoins;
      const npcRejectLine = activeShop === "magic" 
        ? "Você não tem essências suficientes! As brumas e relíquias cobram seu preço espiritual."
        : "Você não tem moedas suficientes! Aço e segredos custam caro no Mercado de Okami.";

      if (balance < adjustedPrice) {
        speakNpcLine(npcRejectLine, { hideAfter: 3500 });
        return;
      }

      // Validação de espaço no inventário
      if (inventoryItems.length >= 12) {
        speakNpcLine("Seu inventário está cheio! Não cabe mais nada nas suas bolsas.", { hideAfter: 3500 });
        return;
      }

      if (activeShop === "magic") {
        playerEssences -= adjustedPrice;
      } else {
        playerCoins -= adjustedPrice;
      }

      const newItem = {
        ...item,
        price: adjustedPrice,
        inventoryId: `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      };
      
      inventoryItems.push(newItem);

      if (firebaseDb && currentRpgId && currentUser) {
        try {
          const itemSnapshot = {
            name: item.name,
            category: item.category,
            rarity: item.rarity,
            price: item.price,
            pricePaid: adjustedPrice,
            shopType: item.shopType || "normal",
            damage: item.damage || "",
            defense: item.defense || "",
            healing: item.healing || "",
            durability: item.durability || "",
            extra: item.extra || "",
            description: item.description || "",
            story: item.story || "",
            npcLine: item.npcLine || ""
          };

          await firebaseDb.collection("playerInventories").add({
            rpgId: currentRpgId,
            playerUid: currentUser.uid,
            playerName: currentUserProfile?.displayName || currentUser.displayName || currentUser.email,
            playerEmail: currentUser.email,
            itemId: item.firestoreId || item.id,
            itemSnapshot,
            quantity: 1,
            acquiredAt: fieldValue().serverTimestamp(),
            source: "shop"
          });

          if (item.firestoreId && item.stock > 0) {
            await firebaseDb.collection("rpgItems").doc(item.firestoreId).set(
              {
                stock: fieldValue().increment(-1),
                updatedAt: fieldValue().serverTimestamp()
              },
              { merge: true }
            );
          }

          await writeRpgLog(
            "item.purchased",
            "rpgItems",
            item.firestoreId || item.id,
            `${currentUserProfile?.displayName || currentUser.email} comprou ${item.name} por ${adjustedPrice} ${currencyName}.`,
            { itemSnapshot }
          );
          await Promise.all([loadPlayerInventoryFromDb(), loadShopItemsFromDb()]);
        } catch (error) {
          console.error(error);
          if (activeShop === "magic") {
            playerEssences += adjustedPrice;
          } else {
            playerCoins += adjustedPrice;
          }
          updateCoinsUI();
          speakNpcLine("A compra falhou no registro da campanha. Tente outra vez.", { hideAfter: 3500 });
          return;
        }
      } else {
        saveGameToLocalStorage();
        renderInventory();
        renderShopItems();
      }

      updateCoinsUI();
      speakNpcLine(`Excelente escolha! A ${item.name} agora é sua.`, { hideAfter: 3500 });
    });

    card.addEventListener("mouseenter", () => {
      isHoveringItem = true;
      if (!isTalkingToNpc) {
        typeNpcLine(item.npcLine);
      }
      updateNpcState();
    });

    card.addEventListener("mouseleave", () => {
      isHoveringItem = false;
      if (!isTalkingToNpc) {
        typeNpcLine(defaultNpcLine);
      }
      updateNpcState();
    });

    card.addEventListener("click", () => {
      openShopItemId = openShopItemId === item.id ? "" : item.id;
      renderShopItems();
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openShopItemId = openShopItemId === item.id ? "" : item.id;
        renderShopItems();
      }
    });

    buyArea.append(price, buyButton);
    card.append(info, buyArea, createItemDetails(item));
    shopList.append(card);
  });
}

function renderInventory() {
  const totalSlots = 12;
  inventoryGrid.innerHTML = "";

  if (inventoryItems.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state inventory-empty-state";
    emptyState.textContent = "Nenhum item foi confiado a este viajante.";
    inventoryGrid.append(emptyState);
  }

  for (let index = 0; index < totalSlots; index += 1) {
    const item = inventoryItems[index];
    const slot = document.createElement(item ? "article" : "div");
    slot.className = item
      ? "inventory-slot inventory-card is-filled"
      : "inventory-slot";

    if (item && item.rarity) {
      slot.classList.add(`rarity-${item.rarity.toLowerCase().replace("é", "e").replace("á", "a")}`);
    }

    if (!item) {
      inventoryGrid.append(slot);
      continue;
    }

    slot.classList.toggle("is-open", openInventoryItemId === item.inventoryId);
    slot.tabIndex = 0;

    const title = document.createElement("h2");
    title.innerHTML = item.name.replaceAll(" ", "<br />");

    const meta = document.createElement("p");
    meta.className = "item-meta";
    meta.textContent = `${item.category} | ${item.rarity}`;

    slot.addEventListener("click", () => {
      openInventoryItemId = openInventoryItemId === item.inventoryId ? "" : item.inventoryId;
      renderInventory();
    });

    slot.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openInventoryItemId = openInventoryItemId === item.inventoryId ? "" : item.inventoryId;
        renderInventory();
      }
    });

    slot.append(title, meta, createItemDetails(item, true));
    inventoryGrid.append(slot);
  }
}

// --- RENDERIZAÇÃO DO MURAL DE CONTRATOS ---

function renderMural() {
  const muralList = document.querySelector("#mural-list");
  if (!muralList) return;

  muralList.innerHTML = "";

  if (muralMissions.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "Nenhum contrato pendente no mural.";
    muralList.append(emptyState);
    return;
  }

  muralMissions.forEach((mission) => {
    const card = document.createElement("article");
    card.className = `mural-card mission-${mission.status}`;

    const title = document.createElement("h2");
    title.textContent = mission.title;

    // Linha de Meta (Dificuldade e Tempo)
    const metaRow = document.createElement("div");
    metaRow.className = "mission-meta-row";

    const diffBadge = document.createElement("span");
    const diffText = mission.difficulty || "Moderada";
    // Remove acentos para usar como classe CSS
    const diffClass = diffText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    diffBadge.className = `difficulty-badge diff-${diffClass}`;
    diffBadge.textContent = diffText;

    const timeItem = document.createElement("span");
    timeItem.className = "mission-meta-item";
    timeItem.innerHTML = `⏳ ${mission.timeEstimate || "uma noite"}`;

    metaRow.append(diffBadge, timeItem);

    const desc = document.createElement("p");
    desc.className = "mission-desc";
    desc.textContent = generateMissionNarrative(mission);

    const req = document.createElement("p");
    req.className = "mission-requirement";
    req.innerHTML = `<strong>Requisito:</strong> ${mission.requirementText}`;

    const rew = document.createElement("p");
    rew.className = "mission-reward";
    
    // Calcula o reajuste de reputação para exibição (ex: -2%)
    const repValue = Math.round((mission.reputationReward || 0) * 100);
    const repText = repValue !== 0 ? ` | Reputação: ${repValue}% preços` : "";
    rew.innerHTML = `<strong>Recompensa:</strong> 🪙 ${mission.reward} moedas${repText}`;

    const actionArea = document.createElement("div");
    actionArea.className = "mission-actions";

    if (mission.status === "available") {
      const acceptBtn = document.createElement("button");
      acceptBtn.className = "mural-btn accept-btn";
      acceptBtn.type = "button";
      acceptBtn.textContent = "Aceitar Contrato";
      acceptBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        mission.status = "accepted";
        saveGameToLocalStorage();
        renderMural();
        speakNpcLine(`Um contrato para "${mission.title}" assinado com sangue. Traga o necessário quando terminar.`, { hideAfter: 4500 });
      });
      actionArea.appendChild(acceptBtn);
    } else if (mission.status === "accepted") {
      const statusBadge = document.createElement("span");
      statusBadge.className = "mission-badge badge-accepted";
      statusBadge.textContent = "Contrato Ativo";

      const completeBtn = document.createElement("button");
      completeBtn.className = "mural-btn complete-btn";
      completeBtn.type = "button";
      completeBtn.textContent = "Concluir Contrato";

      const hasReq = checkMissionRequirement(mission, inventoryItems);
      if (!hasReq) {
        completeBtn.disabled = true;
        completeBtn.title = "Você não possui os itens necessários.";
      }

      completeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!checkMissionRequirement(mission, inventoryItems)) return;

        // Consumir item do inventário se a missão exigir
        if (mission.consumeItem && mission.consumeItem !== "false" && mission.consumeItem !== "") {
          let consumedItemId = null;
          if (Array.isArray(mission.consumeItem)) {
            consumedItemId = mission.consumeItem.find(id => inventoryItems.some(item => item.id === id));
          } else if (typeof mission.consumeItem === "string") {
            const ids = mission.consumeItem.split(",").map(s => s.trim());
            consumedItemId = ids.find(id => inventoryItems.some(item => item.id === id));
          } else if (mission.consumeItem === true || mission.consumeItem === "true") {
            if (mission.requiredType === "item") {
              const requiredValue = mission.requiredValue || "";
              const requiredIds = typeof requiredValue === "string" 
                ? requiredValue.split(",").map(s => s.trim()) 
                : [];
              consumedItemId = requiredIds.find(id => inventoryItems.some(id => id.id === id));
            } else if (mission.requiredType === "category") {
              const matchedItem = inventoryItems.find(item => item.category === mission.requiredValue);
              if (matchedItem) consumedItemId = matchedItem.id;
            }
          }

          if (consumedItemId) {
            const index = inventoryItems.findIndex(item => item.id === consumedItemId);
            if (index !== -1) {
              inventoryItems.splice(index, 1);
            }
          }
        }

        playerCoins += Number(mission.reward) || 0;
        mission.status = "completed";
        saveGameToLocalStorage();
        updateCoinsUI();
        renderInventory();
        renderMural();
        
        // Efeito sutil no preço da loja por reputação de missões
        const priceChange = Number(mission.reputationReward) || -0.01;
        applyPriceEffect(priceChange);
        speakNpcLine(`Contrato "${mission.title}" cumprido. Excelente. Aqui está o seu pagamento de ${mission.reward} moedas.`, { hideAfter: 4500 });
      });

      actionArea.appendChild(statusBadge);
      actionArea.appendChild(completeBtn);
    } else if (mission.status === "completed") {
      const statusBadge = document.createElement("span");
      statusBadge.className = "mission-badge badge-completed";
      statusBadge.textContent = "✓ Concluído";
      actionArea.appendChild(statusBadge);
    }

    card.appendChild(title);
    card.appendChild(metaRow);
    card.appendChild(desc);
    card.appendChild(req);
    card.appendChild(rew);
    card.appendChild(actionArea);

    muralList.appendChild(card);
  });
}

let currentMuralSubView = "contracts"; // "contracts" or "dossiers"

function renderDossiers() {
  const dossiersList = document.querySelector("#dossiers-list");
  const detailCard = document.querySelector("#dossier-detail-card");
  if (!dossiersList) return;

  dossiersList.innerHTML = "";
  if (detailCard) detailCard.style.display = "none";

  const isCreator = currentMemberRole === "creator" || currentMemberRole === "owner";
  // Filter visible dossiers based on role
  const visibleDossiers = characterDossiers.filter((d) => {
    if (isCreator) return true; // Creator sees all
    return d.approval === "aprovada"; // Players see only approved ones
  });

  if (visibleDossiers.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "Nenhum dossiê disponível para visualização.";
    dossiersList.append(emptyState);
    return;
  }

  visibleDossiers.forEach((dossier) => {
    const card = document.createElement("article");
    card.className = "dossier-card";
    
    // Status Seal for Creators
    if (isCreator) {
      const seal = document.createElement("span");
      seal.className = `dossier-seal seal-${dossier.approval}`;
      seal.textContent = dossier.approval;
      card.appendChild(seal);
    }

    const avatarWrap = document.createElement("div");
    avatarWrap.className = "dossier-avatar-wrap";
    const img = document.createElement("img");
    img.src = dossier.avatarUrl || "assets/img/NPC1.png";
    img.alt = `Retrato de ${dossier.name}`;
    avatarWrap.appendChild(img);

    const name = document.createElement("h3");
    name.textContent = dossier.name;

    const subtitle = document.createElement("p");
    subtitle.className = "dossier-subtitle";
    subtitle.textContent = `${dossier.title} | ${dossier.faction}`;

    card.append(avatarWrap, name, subtitle);

    card.addEventListener("click", () => {
      openDossierDetail(dossier);
    });

    dossiersList.appendChild(card);
  });
}

function openDossierDetail(dossier) {
  const detailCard = document.querySelector("#dossier-detail-card");
  if (!detailCard) return;

  detailCard.innerHTML = "";
  detailCard.style.display = "block";

  const closeBtn = document.createElement("button");
  closeBtn.className = "dossier-detail-close";
  closeBtn.type = "button";
  closeBtn.innerHTML = "✖";
  closeBtn.addEventListener("click", () => {
    detailCard.style.display = "none";
  });

  const confidentialStamp = document.createElement("div");
  confidentialStamp.className = "dossier-stamp-confidential";
  confidentialStamp.textContent = "CONFIDENCIAL";

  const grid = document.createElement("div");
  grid.className = "dossier-detail-grid";

  const avatar = document.createElement("div");
  avatar.className = "dossier-detail-avatar";
  const img = document.createElement("img");
  img.src = dossier.avatarUrl || "assets/img/NPC1.png";
  img.alt = dossier.name;
  avatar.appendChild(img);

  const infoSheet = document.createElement("div");
  infoSheet.className = "dossier-info-sheet";

  const isCreator = currentMemberRole === "creator" || currentMemberRole === "owner";

  // Fields mapping
  const fields = [
    ["Nome", dossier.name],
    ["Título/Cargo", dossier.title],
    ["Clã/Facção", dossier.faction],
    ["Status do Alvo", dossier.status],
    ["Traços", dossier.traits],
    ["Relação", dossier.relationship]
  ];

  if (isCreator && dossier.secrets) {
    fields.push(["Segredos (Mestre)", dossier.secrets]);
  }

  fields.forEach(([label, value]) => {
    if (value) {
      const field = document.createElement("p");
      field.className = "dossier-info-field";
      field.innerHTML = `<strong>${label}:</strong> ${value}`;
      infoSheet.appendChild(field);
    }
  });

  // Biography block
  const bio = document.createElement("p");
  bio.className = "dossier-info-field";
  bio.style.marginTop = "10px";
  bio.innerHTML = `<strong>Dossiê Narrativo:</strong><br/>${dossier.biography}`;
  infoSheet.appendChild(bio);

  grid.append(avatar, infoSheet);
  detailCard.append(closeBtn, confidentialStamp, grid);
  
  detailCard.scrollIntoView({ behavior: "smooth" });
}

// --- FUNDOS ROTATIVOS E PARTÍCULAS ---

function setInitialBackgrounds() {
  backgroundLayers.forEach((layer, index) => {
    layer.style.backgroundImage = `url("${backgroundImages[index]}")`;
    layer.classList.toggle("is-visible", index === 0);
  });
}

function rotateBackground() {
  activeBackgroundIndex = (activeBackgroundIndex + 1) % backgroundImages.length;
  activeBackgroundLayer = activeBackgroundLayer === 0 ? 1 : 0;

  const incomingLayer = backgroundLayers[activeBackgroundLayer];
  const outgoingLayer = backgroundLayers[activeBackgroundLayer === 0 ? 1 : 0];

  incomingLayer.style.backgroundImage = `url("${backgroundImages[activeBackgroundIndex]}")`;
  incomingLayer.classList.add("is-visible");
  outgoingLayer.classList.remove("is-visible");
}

function createParticles() {
  const particleColors = ["#ffd479", "#f08a24", "#b94725", "#d8a84f", "#7d776c"];
  const particleCount = 42;

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("span");
    const size = 3 + Math.floor(Math.random() * 7);
    const color = particleColors[Math.floor(Math.random() * particleColors.length)];
    const drift = Math.floor(Math.random() * 180) - 90;
    const duration = 6 + Math.random() * 8;
    const delay = Math.random() * -12;

    particle.className = "pixel-particle";
    particle.style.setProperty("--particle-size", `${size}px`);
    particle.style.setProperty("--particle-x", `${Math.random() * 100}%`);
    particle.style.setProperty("--particle-color", color);
    particle.style.setProperty("--particle-drift", `${drift}px`);
    particle.style.setProperty("--particle-duration", `${duration}s`);
    particle.style.setProperty("--particle-delay", `${delay}s`);

    particleField.append(particle);
  }
}

function emitButtonSparks(x, y) {
  if (!clickParticleField) {
    return;
  }

  const sparkColors = ["#ffd479", "#f2b442", "#d89b35", "#fff9c5", "#c28a2a", "#e8e0c8"];
  const sparkCount = 12;
  const baseX = x;
  const baseY = y;

  for (let index = 0; index < sparkCount; index += 1) {
    const spark = document.createElement("span");
    const size = 2 + Math.floor(Math.random() * 4);
    const angle = (Math.PI * 2 * index) / sparkCount + (Math.random() * 0.4 - 0.2);
    const distance = 16 + Math.random() * 34;
    const duration = 0.2 + Math.random() * 0.2;
    const velocityX = Math.cos(angle) * distance;
    const velocityY = Math.sin(angle) * distance;
    const color = sparkColors[Math.floor(Math.random() * sparkColors.length)];

    spark.className = "spark-particle";
    spark.style.left = `${baseX - size / 2}px`;
    spark.style.top = `${baseY - size / 2}px`;
    spark.style.setProperty("--spark-size", `${size}px`);
    spark.style.setProperty("--spark-color", color);
    spark.style.setProperty("--spark-duration", `${duration}s`);
    spark.style.setProperty("--spark-x", `${velocityX}px`);
    spark.style.setProperty("--spark-y", `${velocityY}px`);

    clickParticleField.append(spark);
    window.setTimeout(() => spark.remove(), duration * 1000 + 40);
  }
}

function getClickSparkPoint(x, y) {
  return {
    x: x + 14,
    y: y + 24,
  };
}

function triggerButtonImpact(button, x, y) {
  const rect = button.getBoundingClientRect();
  const impactX = ((x - rect.left) / rect.width) * 100;
  const impactY = ((y - rect.top) / rect.height) * 100;

  button.style.setProperty("--impact-x", `${impactX}%`);
  button.style.setProperty("--impact-y", `${impactY}%`);
  button.classList.add("is-pressed", "button-impact");

  window.setTimeout(() => {
    button.classList.remove("is-pressed", "button-impact");
  }, 180);
}

function openScreen(screenName) {
  screens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.dataset.screen === screenName);
  });
}

function setNpcImage(mode) {
  npcImage.src = npcImages[mode];
  syncChatPortrait(mode);
}

function updateNpcState() {
  if (isTalkingToNpc || isHoveringNpc) {
    setNpcImage("talk");
    return;
  }
  if (isHoveringItem) {
    setNpcImage("goods");
    return;
  }
  setNpcImage("normal");
}

// --- EVENTOS E LISTENER BINDING ---

playerAuthForm?.querySelectorAll("[data-auth-action]").forEach((button) => {
  button.addEventListener("click", () => {
    lastPlayerAuthAction = button.dataset.authAction;
  });
});

playerAuthForm?.addEventListener("submit", handlePlayerAuth);
creatorAuthForm?.addEventListener("submit", handleCreatorLogin);
createRpgForm?.addEventListener("submit", handleCreateRpg);
creatorItemForm?.addEventListener("submit", handleCreatorItemSubmit);
creatorLoreForm?.addEventListener("submit", handleCreatorLoreSubmit);
document.querySelector("#creator-mural-form")?.addEventListener("submit", handleCreatorMuralSubmit);
document.querySelector("#creator-dossiers-form")?.addEventListener("submit", handleCreatorDossierSubmit);

document.querySelector("#item-form-clear")?.addEventListener("click", clearItemForm);
document.querySelector("#lore-form-clear")?.addEventListener("click", clearLoreForm);
document.querySelector("#mural-form-clear")?.addEventListener("click", clearMuralForm);
document.querySelector("#dossiers-form-clear")?.addEventListener("click", clearDossierForm);
document.querySelector("#refresh-inventories")?.addEventListener("click", loadCreatorInventories);
document.querySelector("#inventory-search")?.addEventListener("input", loadCreatorInventories);
document.querySelector("#refresh-logs")?.addEventListener("click", loadCreatorLogs);

// Alternador de Sub-telas no Mural (Contratos vs Dossiês)
document.querySelector("#open-dossiers-btn")?.addEventListener("click", () => {
  const contractsView = document.querySelector("#mural-contracts-view");
  const dossiersView = document.querySelector("#mural-dossiers-view");
  const dossiersBtn = document.querySelector("#open-dossiers-btn");
  
  if (currentMuralSubView === "contracts") {
    if (contractsView) contractsView.style.display = "none";
    if (dossiersView) dossiersView.style.display = "block";
    if (dossiersBtn) {
      dossiersBtn.textContent = "📜 Contratos";
      dossiersBtn.title = "Ver Contratos do Mural";
    }
    currentMuralSubView = "dossiers";
    renderDossiers();
  } else {
    if (contractsView) contractsView.style.display = "block";
    if (dossiersView) dossiersView.style.display = "none";
    if (dossiersBtn) {
      dossiersBtn.textContent = "👥 Dossiês";
      dossiersBtn.title = "Ver Dossiês de Personagens";
    }
    currentMuralSubView = "contracts";
    renderMural();
  }
});

document.querySelector("#back-to-contracts-btn")?.addEventListener("click", () => {
  const contractsView = document.querySelector("#mural-contracts-view");
  const dossiersView = document.querySelector("#mural-dossiers-view");
  const dossiersBtn = document.querySelector("#open-dossiers-btn");
  
  if (contractsView) contractsView.style.display = "block";
  if (dossiersView) dossiersView.style.display = "none";
  if (dossiersBtn) {
    dossiersBtn.textContent = "👥 Dossiês";
    dossiersBtn.title = "Ver Dossiês de Personagens";
  }
  currentMuralSubView = "contracts";
  renderMural();
});

creatorTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const targetId = tab.dataset.creatorTab;

    creatorTabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    creatorSections.forEach((section) => {
      section.classList.toggle("is-active", section.id === targetId);
    });

    if (targetId === "creator-shop") {
      loadCreatorItems();
    }
    if (targetId === "creator-inventories") {
      loadCreatorInventories();
    }
    if (targetId === "creator-lore") {
      loadCreatorLore();
    }
    if (targetId === "creator-logs") {
      loadCreatorLogs();
    }
  });
});

navigationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const screenName = button.dataset.openScreen;
    console.log(`Tela aberta: ${screenName}`);
    openScreen(screenName);

    if (screenName === "mural") {
      renderMural();
    }
    if (screenName === "shop") {
      loadShopItemsFromDb();
    }
    if (screenName === "items") {
      loadPlayerInventoryFromDb();
    }
    if (screenName === "lore") {
      loadLoreFromDb();
    }
    if (screenName === "menu") {
      if (canUseCreatorPanel()) {
        loadCreatorDashboardData();
      }
    }
  });
});

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    openShopItemId = "";
    isHoveringItem = false;
    if (!isTalkingToNpc) {
      typeNpcLine(defaultNpcLine);
    }

    categoryButtons.forEach((categoryButton) => {
      categoryButton.classList.toggle("is-active", categoryButton === button);
    });

    renderShopItems();
  });
});

shopSearch.addEventListener("input", () => {
  openShopItemId = "";
  isHoveringItem = false;
  renderShopItems();
});

npcButton.addEventListener("mouseenter", () => {
  isHoveringNpc = true;
  if (!isTalkingToNpc) {
    typeNpcLine("Chegue mais perto. Algumas mercadorias só falam quando alguém escuta.");
  }
  updateNpcState();
});

npcButton.addEventListener("mouseleave", () => {
  isHoveringNpc = false;
  if (!isTalkingToNpc && !isHoveringItem) {
    typeNpcLine(defaultNpcLine);
  }
  updateNpcState();
});

npcButton.addEventListener("click", (event) => {
  event.stopPropagation();
  startNpcConversation();
});

npcConversation?.addEventListener("click", (event) => {
  event.stopPropagation();
});

npcDialog.addEventListener("click", (event) => {
  event.stopPropagation();
});

chatCloseButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  closeNpcConversation();
});

chatEndAction?.addEventListener("click", (event) => {
  event.stopPropagation();
  closeNpcConversation();
});

chatShopAction?.addEventListener("click", (event) => {
  event.stopPropagation();
  isTalkingToNpc = true;
  updateNpcState();
  updateChatStatus();

  if (shopItems.length === 0) {
    renderShopItems();
    speakNpcLine("As prateleiras aguardam o primeiro carregamento. Até Kisuke-san precisa de estoque.", {
      onComplete: () => {
        if (isTalkingToNpc) {
          renderNpcConversation();
        }
      }
    });
    return;
  }

  openShopItemId = shopItems[0]?.id || "";
  renderShopItems();
  shopList?.scrollTo({ top: 0, behavior: "smooth" });
  speakNpcLine("Comece pela primeira lâmina da prateleira. Ela é direta, o que já é raro por aqui.", {
    onComplete: () => {
      if (isTalkingToNpc) {
        renderNpcConversation();
      }
    }
  });
});

document.addEventListener("click", (event) => {
  if (isTalkingToNpc && event.target.closest(".undertale-chat")) {
    event.stopPropagation();
  }
});

document.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) {
    return;
  }

  const impactPoint = getClickSparkPoint(event.clientX, event.clientY);
  emitButtonSparks(impactPoint.x, impactPoint.y);

  const button = event.target.closest("button");
  if (button) {
    triggerButtonImpact(button, impactPoint.x, impactPoint.y);
  }
});

const resetProgressBtn = document.querySelector("#reset-progress-btn");
resetProgressBtn?.addEventListener("click", (event) => {
  event.stopPropagation();
  if (confirm("Você deseja limpar toda a sua jornada e recomeçar no vilarejo de Okami?")) {
    initializeNewGame();
    loadGameFromLocalStorage();
    renderInventory();
    renderShopItems();
    renderMural();
    speakNpcLine("Uma nova jornada se inicia. As cinzas do reino guardam novos mistérios.", { hideAfter: 4500 });
  }
});

// --- BOTÕES DE SIMULAÇÃO DE TESTE (SEM FIREBASE) ---

const testLoginPlayerBtn = document.querySelector("#test-login-player");
const testLoginCreatorBtn = document.querySelector("#test-login-creator");

testLoginPlayerBtn?.addEventListener("click", (event) => {
  event.stopPropagation();
  
  // Define sessão simulada de jogador
  currentUser = {
    uid: "test-player-uid",
    email: "jogador_teste@okami.com",
    displayName: "Viajante de Teste"
  };
  currentUserProfile = {
    displayName: "Viajante de Teste",
    email: "jogador_teste@okami.com",
    roleDefault: "player"
  };
  currentRpgId = "test-campaign-id";
  currentRpgName = "Cinzas de Okami (Campanha de Teste)";
  currentMemberRole = "player";
  
  setAuthStatus("Sessão simulada ativa: jogador_teste@okami.com.", "success");
  updateCoinsUI();
  renderInventory();
  renderShopItems();
  renderMural();
  updateRoleVisibility();
  
  openScreen("menu");
  speakNpcLine("Selo de teste ativado. Bem-vindo de volta, Viajante de Teste.", { hideAfter: 4500 });
});

testLoginCreatorBtn?.addEventListener("click", (event) => {
  event.stopPropagation();
  
  // Define sessão simulada de criador
  currentUser = {
    uid: "test-creator-uid",
    email: "mestre_teste@okami.com",
    displayName: "Mestre de Teste"
  };
  currentUserProfile = {
    displayName: "Mestre de Teste",
    email: "mestre_teste@okami.com",
    roleDefault: "creator"
  };
  currentRpgId = "test-campaign-id";
  currentRpgName = "Cinzas de Okami (Campanha de Teste)";
  currentMemberRole = "creator";
  
  setAuthStatus("Sessão simulada ativa: mestre_teste@okami.com.", "success");
  updateCoinsUI();
  renderInventory();
  renderShopItems();
  renderMural();
  updateRoleVisibility();
  
  openScreen("menu");
  speakNpcLine("Chave dos Criadores ativada. A oficina do mestre está aberta.", { hideAfter: 4500 });
});

// --- ALTERNADOR DE PAPEL NO MENU PRINCIPAL ---

const switchToPlayerBtn = document.querySelector("#switch-to-player");
const switchToCreatorBtn = document.querySelector("#switch-to-creator");

function updateActiveRoleButtons() {
  if (switchToPlayerBtn && switchToCreatorBtn) {
    const isCreator = currentMemberRole === "creator" || currentMemberRole === "owner";
    switchToPlayerBtn.classList.toggle("is-active", !isCreator);
    switchToCreatorBtn.classList.toggle("is-active", isCreator);
  }
}

switchToPlayerBtn?.addEventListener("click", async (event) => {
  event.stopPropagation();
  currentMemberRole = "player";
  updateRoleVisibility();
  if (firebaseDb && currentRpgId) {
    await Promise.all([loadLoreFromDb(), loadShopItemsFromDb()]);
  }
  speakNpcLine("Seu selo foi alterado para Jogador.", { hideAfter: 3500 });
});

switchToCreatorBtn?.addEventListener("click", async (event) => {
  event.stopPropagation();
  currentMemberRole = "creator";
  updateRoleVisibility();
  if (firebaseDb && currentRpgId) {
    await Promise.all([loadLoreFromDb(), loadShopItemsFromDb(), loadCreatorDashboardData()]);
  }
  speakNpcLine("Seu selo foi alterado para Criador. A oficina do mestre está aberta.", { hideAfter: 3500 });
});

// --- MANIPULADORES DE PAINÉIS DE CRIAÇÃO INLINE (MESTRE) ---

function showCreatorBackdrop() {
  const backdrop = document.querySelector("#creator-backdrop");
  if (backdrop) backdrop.hidden = false;
}

function hideCreatorBackdrop() {
  const backdrop = document.querySelector("#creator-backdrop");
  if (backdrop) backdrop.hidden = true;
}

function openCreatorPanel(panelId, loadFn) {
  const panels = [
    "#inline-creator-shop",
    "#inline-creator-inventories",
    "#inline-creator-lore",
    "#inline-creator-logs",
    "#inline-creator-mural",
    "#inline-creator-dossiers"
  ];
  
  const targetPanel = document.querySelector(panelId);
  if (!targetPanel) return;

  const wasHidden = targetPanel.hidden;

  // Fecha todas as oficinas primeiro
  panels.forEach(id => {
    const p = document.querySelector(id);
    if (p) p.hidden = true;
  });

  // Abre ou fecha o painel selecionado
  if (wasHidden) {
    targetPanel.hidden = false;
    if (loadFn) loadFn();
    showCreatorBackdrop();
  } else {
    targetPanel.hidden = true;
    hideCreatorBackdrop();
  }
}

document.querySelector("#toggle-creator-shop")?.addEventListener("click", (event) => {
  event.stopPropagation();
  openCreatorPanel("#inline-creator-shop", loadCreatorItems);
});

document.querySelector("#toggle-creator-inventories")?.addEventListener("click", (event) => {
  event.stopPropagation();
  openCreatorPanel("#inline-creator-inventories", loadCreatorInventories);
});

document.querySelector("#toggle-creator-lore")?.addEventListener("click", (event) => {
  event.stopPropagation();
  openCreatorPanel("#inline-creator-lore", loadCreatorLore);
});

document.querySelector("#toggle-creator-mural")?.addEventListener("click", (event) => {
  event.stopPropagation();
  openCreatorPanel("#inline-creator-mural", loadCreatorMural);
});

document.querySelector("#toggle-creator-dossiers")?.addEventListener("click", (event) => {
  event.stopPropagation();
  openCreatorPanel("#inline-creator-dossiers", loadCreatorDossiers);
});

document.querySelector("#toggle-creator-logs")?.addEventListener("click", (event) => {
  event.stopPropagation();
  openCreatorPanel("#inline-creator-logs", loadCreatorLogs);
});

// Botões de fechar os painéis inline
document.querySelector("#close-creator-shop-btn")?.addEventListener("click", (event) => {
  event.stopPropagation();
  const panel = document.querySelector("#inline-creator-shop");
  if (panel) panel.hidden = true;
  hideCreatorBackdrop();
});

document.querySelector("#close-creator-inventories-btn")?.addEventListener("click", (event) => {
  event.stopPropagation();
  const panel = document.querySelector("#inline-creator-inventories");
  if (panel) panel.hidden = true;
  hideCreatorBackdrop();
});

document.querySelector("#close-creator-lore-btn")?.addEventListener("click", (event) => {
  event.stopPropagation();
  const panel = document.querySelector("#inline-creator-lore");
  if (panel) panel.hidden = true;
  hideCreatorBackdrop();
});

document.querySelector("#close-creator-mural-btn")?.addEventListener("click", (event) => {
  event.stopPropagation();
  const panel = document.querySelector("#inline-creator-mural");
  if (panel) panel.hidden = true;
  hideCreatorBackdrop();
});

document.querySelector("#close-creator-dossiers-btn")?.addEventListener("click", (event) => {
  event.stopPropagation();
  const panel = document.querySelector("#inline-creator-dossiers");
  if (panel) panel.hidden = true;
  hideCreatorBackdrop();
});

document.querySelector("#close-creator-logs-btn")?.addEventListener("click", (event) => {
  event.stopPropagation();
  const panel = document.querySelector("#inline-creator-logs");
  if (panel) panel.hidden = true;
  hideCreatorBackdrop();
});

// Fechar ao clicar no backdrop escuro do fundo
document.querySelector("#creator-backdrop")?.addEventListener("click", (event) => {
  event.stopPropagation();
  const panels = [
    "#inline-creator-shop",
    "#inline-creator-inventories",
    "#inline-creator-lore",
    "#inline-creator-logs",
    "#inline-creator-mural",
    "#inline-creator-dossiers"
  ];
  panels.forEach(id => {
    const p = document.querySelector(id);
    if (p) p.hidden = true;
  });
  hideCreatorBackdrop();
});


// --- FILTRAGEM E CATEGORIAS DA LORE ---
let activeLoreCategory = "Todos";

function setupLoreFilters() {
  const buttons = document.querySelectorAll("[data-lore-category]");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      activeLoreCategory = btn.getAttribute("data-lore-category");
      buttons.forEach(b => b.classList.toggle("is-active", b === btn));
      renderLore();
    });
  });
}

// --- INICIALIZAÇÃO GERAL DO JOGO ---

loadGameFromLocalStorage();
setInitialBackgrounds();
initializeFirebaseServices();
window.setInterval(rotateBackground, 8000);
createParticles();
updateNpcState();
updateChatStatus();
typeNpcLine(defaultNpcLine);
renderShopItems();
renderInventory();
renderMural();
setupLoreFilters();

// --- LISTENERS DE ALTERNAÇÃO DE LOJA ---
function setupShopSwitcher() {
  const switchNormal = document.querySelector("#shop-switch-normal");
  const switchMagic = document.querySelector("#shop-switch-magic");
  const shopPanel = document.querySelector(".panel--shop");
  const chatNpcNameElement = document.querySelector("#undertale-chat .chat-header strong");

  if (!switchNormal || !switchMagic) return;

  const handleShopSwitch = (type) => {
    activeShop = type;
    
    // Toggle active classes on buttons
    switchNormal.classList.toggle("is-active", type === "normal");
    switchMagic.classList.toggle("is-active", type === "magic");
    
    // Toggle theme on panel
    if (shopPanel) {
      shopPanel.classList.toggle("theme-magic", type === "magic");
    }

    // Set active NPC name in chat header
    if (chatNpcNameElement) {
      chatNpcNameElement.textContent = type === "magic" ? "Genzo, o Eremita" : "Soiren Kisuke";
    }

    // Reset filters and active item selections
    activeCategory = "Todos";
    categoryButtons.forEach(b => {
      const cat = b.getAttribute("data-category");
      b.classList.toggle("is-active", cat === "Todos");
    });
    openShopItemId = "";
    isHoveringItem = false;

    // Reset dialogue indexes
    defaultLineIndex = 0;
    idleLineIndex = 0;
    hoverLineIndex = 0;
    introLineIndex = 0;
    
    // Close dialogue if active to prevent state mismatch
    closeNpcConversation();

    // Type the new vendor's default line
    typeNpcLine(getNextDefaultLine());
    
    // Re-render items and update coins
    renderShopItems();
    updateCoinsUI();
  };

  switchNormal.addEventListener("click", () => handleShopSwitch("normal"));
  switchMagic.addEventListener("click", () => handleShopSwitch("magic"));
}

setupShopSwitcher();

// --- CONFIGURAÇÃO DE EVENTOS DE UPLOAD DO RETRATO (DOSSIÊS) ---
function setupDossierFormListeners() {
  const fileInput = document.querySelector("#dossier-avatar-file");
  const urlInput = document.querySelector("#dossier-avatar");
  const previewImg = document.querySelector("#dossier-avatar-preview");

  fileInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result;
      if (urlInput) urlInput.value = base64String;
      if (previewImg) previewImg.src = base64String;
    };
    reader.readAsDataURL(file);
  });

  urlInput?.addEventListener("input", () => {
    if (previewImg) {
      previewImg.src = urlInput.value || "assets/img/NPC1.png";
    }
  });
}

setupDossierFormListeners();
