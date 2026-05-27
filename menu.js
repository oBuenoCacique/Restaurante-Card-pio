const WHATSAPP_NUMBER = "+5547992533015";

let deliveryMode = 'delivery'; // 'delivery' ou 'retirada'
let currentProduct = null; // Produto sendo personalizado

// NOVO: Definição de adicionais por produto
const ADICIONAIS = {
    h1: [
        { name: "Bacon Extra", price: 5 },
        { name: "Queijo Extra", price: 4 },
        { name: "Cebola Caramelizada", price: 3 }
    ],
    h2: [
        { name: "Bacon Extra", price: 5 },
        { name: "Gorgonzola Extra", price: 6 },
        { name: "Rúcula Extra", price: 2 }
    ],
    h3: [
        { name: "Cogumelos Extra", price: 7 },
        { name: "Queijo Suíço Extra", price: 5 },
        { name: "Trufa Extra", price: 12 }
    ],
    // Outros produtos podem não ter adicionais
};

const PRODUCTS_DATA = {
    hamburgueres: [
        { id: "h1", name: "Sanduíche de Costela", price: 40, desc: "Pão baguete, rúcula, tomate, costela defumada desfiada, barbecue e queijo.", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80" },
        { id: "h2", name: "Puffe Bacon Blue", price: 34, desc: "Gorgonzola premium, bacon crocante e rúcula.", img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=500&q=80" },
        { id: "h3", name: "Trufa Burguer", price: 42, desc: "Maionese trufada, cogumelos paris e queijo suíço.", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=500&q=80" },
    ],
    porcoes: [
        { id: "p1", name: "Batata Rústica", price: 22, desc: "Temperada com alecrim e páprica defumada.", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80" },
        { id: "p2", name: "Onion Rings", price: 18, desc: "Anéis de cebola crocantes com molho especial.", img: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=500&q=80" },
        { id: "p3", name: "Fritas Trufadas", price: 28, desc: "Batatas fritas com óleo de trufa e parmesão.", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80" },
    ],
    bebidas: [
        { id: "b1", name: "Soda Artesanal", price: 12, desc: "Limão siciliano com xarope de amora.", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80" },
        { id: "b2", name: "Limonada Suíça", price: 10, desc: "Limonada cremosa tradicional.", img: "https://img.freepik.com/fotos-gratis/mojito-bebe-com-limao-limao-e-hortela-na-mesa-de-madeira_1150-12269.jpg" },
        { id: "b3", name: "Chá Gelado", price: 8, desc: "Chá de frutas vermelhas gelado.", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=500&q=80" },
    ],
    sobremesas: [
        { id: "s1", name: "Sorvete de Frutas", price: 15, desc: "Sorvete artesanal com frutas da estação.", img: "https://www.lojabrazil.com.br/blog/wp-content/uploads/2024/04/sobremesas-para-restaurantes-03.jpg" },
        { id: "s2", name: "Brownie Premium", price: 18, desc: "Brownie de chocolate belga com sorvete.", img: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?auto=format&fit=crop&w=500&q=80" },
        { id: "s3", name: "Petit Gateau", price: 22, desc: "Bolinho quente com sorvete de baunilha.", img: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=500&q=80" },
    ],
     sobremesas_do_tio: [
        { id: "ss1", name: "Sorvete de Frutas 22", price: 15, desc: "Sorvete artesanal com frutas da estação.", img: "https://www.lojabrazil.com.br/blog/wp-content/uploads/2024/04/sobremesas-para-restaurantes-03.jpg" },
        { id: "ss2", name: "Brownie Premium 22", price: 18, desc: "Brownie de chocolate belga com sorvete.", img: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?auto=format&fit=crop&w=500&q=80" },
        { id: "ss3", name: "Petit Gateau 22", price: 22, desc: "Bolinho quente com sorvete de baunilha.", img: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=500&q=80" },
    ]
};

const ALL_PRODUCTS = {};

Object.values(PRODUCTS_DATA).forEach(category => {
    category.forEach(product => {
        ALL_PRODUCTS[product.id] = product;
    });
});

const deliveryMap = {
    "ano-bom": 8,
    "bomplandt": 7,
    "caminho-pequeno": 9,
    "centro": 5,
    "itapocu": 10,
    "izabel": 7,
    "joao-tozini": 7,
    "pedra-de-amolar": 10,
    "poco-danta": 10,
    "rio-novo": 12,
    "seminario": 7,
    "xv-de-novembro": 6
};

const coupons = { "BISTRO10": 10, "WELCOME5": 5 };
let cart = JSON.parse(localStorage.getItem("puffeBistroCart")) || [];
if (!Array.isArray(cart)) cart = [];
let discount = 0;

// NOVO: Função para alternar modo de entrega
function setDeliveryMode(mode) {
    deliveryMode = mode;
    const btnDelivery = document.getElementById('btnDelivery');
    const btnRetirada = document.getElementById('btnRetirada');
    const addressSection = document.getElementById('addressSection');

    if (mode === 'delivery') {
        btnDelivery.classList.add('active');
        btnRetirada.classList.remove('active');
        addressSection.classList.add('show');
    } else {
        btnRetirada.classList.add('active');
        btnDelivery.classList.remove('active');
        addressSection.classList.remove('show');
    }

    updateTotals();
}

// Renderizar produtos
function renderProducts() {
    const list1 = document.getElementById("productList");
    list1.innerHTML = PRODUCTS_DATA.hamburgueres.map(p => `
                <div class="card">
                    <img src="${p.img}" alt="${p.name}" class="card-img">
                    <div class="card-content">
                        <h3>${p.name}</h3>
                        <p>${p.desc}</p>
                        <span class="price">R$ ${p.price.toFixed(2)}</span>
                        <button onclick="openAdicionaisModal('${p.id}')">Adicionar ao Pedido</button>
                    </div>
                </div>
            `).join('');

    const list2 = document.getElementById("productList2");
    list2.innerHTML = PRODUCTS_DATA.porcoes.map(p => `
                <div class="card">
                    <img src="${p.img}" alt="${p.name}" class="card-img">
                    <div class="card-content">
                        <h3>${p.name}</h3>
                        <p>${p.desc}</p>
                        <span class="price">R$ ${p.price.toFixed(2)}</span>
                        <button onclick="openAdicionaisModal('${p.id}')">Adicionar ao Pedido</button>
                    </div>
                </div>
            `).join('');

    const list3 = document.getElementById("productList3");
    list3.innerHTML = PRODUCTS_DATA.bebidas.map(p => `
                <div class="card">
                    <img src="${p.img}" alt="${p.name}" class="card-img">
                    <div class="card-content">
                        <h3>${p.name}</h3>
                        <p>${p.desc}</p>
                        <span class="price">R$ ${p.price.toFixed(2)}</span>
                        <button onclick="openAdicionaisModal('${p.id}')">Adicionar ao Pedido</button>
                    </div>
                </div>
            `).join('');

    const list4 = document.getElementById("productList4");
    list4.innerHTML = PRODUCTS_DATA.sobremesas.map(p => `
                <div class="card">
                    <img src="${p.img}" alt="${p.name}" class="card-img">
                    <div class="card-content">
                        <h3>${p.name}</h3>
                        <p>${p.desc}</p>
                        <span class="price">R$ ${p.price.toFixed(2)}</span>
                        <button onclick="openAdicionaisModal('${p.id}')">Adicionar ao Pedido</button>
                    </div>
                </div>
            `).join('');

            const list5 = document.getElementById("productList5");
    list5.innerHTML = PRODUCTS_DATA.sobremesas_do_tio.map(p => `
                <div class="card">
                    <img src="${p.img}" alt="${p.name}" class="card-img">
                    <div class="card-content">
                        <h3>${p.name}</h3>
                        <p>${p.desc}</p>
                        <span class="price">R$ ${p.price.toFixed(2)}</span>
                        <button onclick="openAdicionaisModal('${p.id}')">Adicionar ao Pedido</button>
                    </div>
                </div>
            `).join('');
}

// NOVO: Abrir modal de adicionais
function openAdicionaisModal(productId) {
    currentProduct = ALL_PRODUCTS[productId];
    if (!currentProduct) {
        alert("Produto não encontrado!");
        return;
    }

    document.getElementById('modalProductName').textContent = currentProduct.name;
    document.getElementById('modalObs').value = '';

    const adicionaisContainer = document.getElementById('adicionaisList');
    const adicionais = ADICIONAIS[productId] || [];

    if (adicionais.length > 0) {
        adicionaisContainer.innerHTML = adicionais.map((adicional, index) => `
                    <div class="adicional-item">
                        <label>
                            <input type="checkbox" id="adicional_${index}" data-price="${adicional.price}" data-name="${adicional.name}">
                            <span>${adicional.name}</span>
                        </label>
                        <span class="adicional-price">+R$ ${adicional.price.toFixed(2)}</span>
                    </div>
                `).join('');
    } else {
        adicionaisContainer.innerHTML = '<p style="color: var(--gray); text-align: center;">Sem adicionais disponíveis para este item</p>';
    }

    document.getElementById('adicionaisModal').classList.add('active');
}

// NOVO: Fechar modal
function closeModal() {
    document.getElementById('adicionaisModal').classList.remove('active');
    currentProduct = null;
}

// NOVO: Confirmar adição ao carrinho
function confirmAddToCart() {
    if (!currentProduct) return;

    const adicionais = [];
    const checkboxes = document.querySelectorAll('#adicionaisList input[type="checkbox"]:checked');

    checkboxes.forEach(checkbox => {
        adicionais.push({
            name: checkbox.dataset.name,
            price: parseFloat(checkbox.dataset.price)
        });
    });

    const obs = document.getElementById('modalObs').value.trim();

    const cartItem = {
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        adicionais: adicionais,
        obs: obs,
        uniqueId: Date.now() + Math.random() // ID único para cada item
    };

    cart.push(cartItem);
    saveCart();
    renderCart();
    updateCartCount();
    closeModal();
}

// Remover do carrinho
function removeFromCart(uniqueId) {
    cart = cart.filter(item => item.uniqueId !== uniqueId);
    saveCart();
    renderCart();
    updateCartCount();
}

// Salvar carrinho
function saveCart() {
    localStorage.setItem("puffeBistroCart", JSON.stringify(cart));
}

// Renderizar carrinho
function renderCart() {
    const container = document.getElementById("cartItems");

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--gray); padding:20px;">Carrinho vazio</p>';
        updateTotals();
        return;
    }

    container.innerHTML = cart.map(item => {
        const adicionaisTotal = item.adicionais.reduce((sum, a) => sum + a.price, 0);
        const itemTotal = item.price + adicionaisTotal;

        return `
                    <div class="cart-item">
                        <div class="cart-item-header">
                            <div>
                                <strong>${item.name}</strong><br>
                                <small style="color:var(--gray)">R$ ${item.price.toFixed(2)}</small>
                            </div>
                            <button onclick="removeFromCart(${item.uniqueId})" title="Remover">🗑️</button>
                        </div>
                        ${item.adicionais.length > 0 ? `
                            <div class="cart-item-extras">
                                ${item.adicionais.map(a => `+ ${a.name} (R$ ${a.price.toFixed(2)})`).join('<br>')}
                            </div>
                        ` : ''}
                        ${item.obs ? `<div class="cart-item-obs"> ${item.obs}</div>` : ''}
                        <div style="text-align: right; margin-top: 8px; color: var(--accent); font-weight: 600;">
                            Total: R$ ${itemTotal.toFixed(2)}
                        </div>
                    </div>
                `;
    }).join('');

    updateTotals();
}

// Atualizar totais
function updateTotals() {
    let subtotal = cart.reduce((sum, item) => {
        const adicionaisTotal = item.adicionais.reduce((s, a) => s + a.price, 0);
        return sum + item.price + adicionaisTotal;
    }, 0);

    let delivery = 0;
    if (deliveryMode === 'delivery' && subtotal > 0) {
        const bairro = document.getElementById("bairro").value;
        delivery = deliveryMap[bairro] || 10;
    }

    let total = subtotal + delivery - discount;

    document.getElementById("totals").innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:5px">
                    <span>Subtotal:</span> 
                    <span>R$ ${subtotal.toFixed(2)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:5px">
                    <span>${deliveryMode === 'delivery' ? 'Entrega:' : 'Retirada:'}</span> 
                    <span>R$ ${delivery.toFixed(2)}</span>
                </div>
                ${discount > 0 ? `
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px; color:var(--success)">
                        <span>Desconto:</span> 
                        <span>-R$ ${discount.toFixed(2)}</span>
                    </div>
                ` : ''}
                <div style="display:flex; justify-content:space-between; font-size:1.4rem; margin-top:10px; color:var(--accent)">
                    <strong>Total:</strong> 
                    <strong>R$ ${total.toFixed(2)}</strong>
                </div>
            `;
}

// Atualizar contador do carrinho
function updateCartCount() {
    const count = cart.length;
    const countEl = document.getElementById("cartCount");

    if (count > 0) {
        countEl.textContent = count;
        countEl.style.display = "flex";
    } else {
        countEl.style.display = "none";
    }
}

// Aplicar cupom
function applyCoupon() {
    const code = document.getElementById("coupon").value.toUpperCase().trim();
    if (coupons[code]) {
        discount = coupons[code];
        alert("✨ Cupom aplicado! Desconto de R$ " + discount.toFixed(2));
    } else {
        discount = 0;
        alert("Cupom inválido.");
    }
    updateTotals();
}

// Toggle carrinho
function toggleCart() {
    document.getElementById("cartPanel").classList.toggle("active");
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert("🛒 Seu carrinho está vazio.");
        return;
    }

    const camposObrigatorios = ["nome", "telefone", "pagamento"];

    if (deliveryMode === 'delivery') {
        camposObrigatorios.push("rua", "bairro", "cidade");
    }

    for (let campo of camposObrigatorios) {
        if (!document.getElementById(campo).value) {
            alert("⚠️ Preencha o campo: " + campo.toUpperCase());
            return;
        }
    }

    let subtotal = cart.reduce((sum, item) => {
        const adicionaisTotal = item.adicionais.reduce((s, a) => s + a.price, 0);
        return sum + item.price + adicionaisTotal;
    }, 0);

    let delivery = 0;
    if (deliveryMode === 'delivery') {
        const bairro = document.getElementById("bairro").value;
        delivery = deliveryMap[bairro] || 10;
    }

    let total = subtotal + delivery - discount;

    let msg = `✨ *NOVO PEDIDO - PUFFE BISTRO* ✨\n\n`;
    msg += `👤 *Cliente:* ${document.getElementById("nome").value}\n`;
    msg += `📞 *Tel:* ${document.getElementById("telefone").value}\n\n`;

    if (deliveryMode === 'delivery') {
        msg += ` *ENTREGA*\n`;
        msg += ` *Endereço:* ${document.getElementById("rua").value}, ${document.getElementById("bairro").options[document.getElementById("bairro").selectedIndex].text}, ${document.getElementById("cidade").value}\n`;
        if (document.getElementById("cep").value) msg += ` *CEP:* ${document.getElementById("cep").value}\n`;
    } else {
        msg += `🏪 *RETIRAR NA LOJA*\n`;
    }

    msg += `\n🛒 *Itens do Pedido:*\n`;
    cart.forEach((item, index) => {
        const adicionaisTotal = item.adicionais.reduce((s, a) => s + a.price, 0);
        const itemTotal = item.price + adicionaisTotal;

        msg += `\n${index + 1}. *${item.name}*\n`;
        msg += `   Base: R$ ${item.price.toFixed(2)}\n`;

        if (item.adicionais.length > 0) {
            msg += `   *Adicionais:*\n`;
            item.adicionais.forEach(a => {
                msg += `   • ${a.name}: R$ ${a.price.toFixed(2)}\n`;
            });
        }

        if (item.obs) {
            msg += `   💬 Obs: ${item.obs}\n`;
        }

        msg += `   *Subtotal do item: R$ ${itemTotal.toFixed(2)}*\n`;
    });

    msg += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    msg += ` *Subtotal:* R$ ${subtotal.toFixed(2)}\n`;
    msg += ` *${deliveryMode === 'delivery' ? 'Taxa de Entrega' : 'Retirada'}:* R$ ${delivery.toFixed(2)}\n`;
    if (discount > 0) msg += ` *Desconto:* -R$ ${discount.toFixed(2)}\n`;
    msg += `\n *TOTAL:* R$ ${total.toFixed(2)}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    msg += ` *Pagamento:* ${document.getElementById("pagamento").options[document.getElementById("pagamento").selectedIndex].text}\n`;

    if (document.getElementById("troco").value) {
        msg += ` *Troco para:* R$ ${document.getElementById("troco").value}\n`;
    }

    if (document.getElementById("obs").value) {
        msg += `\n *Observação Geral:* ${document.getElementById("obs").value}`;
    }

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");

    cart = [];
    saveCart();
    renderCart();
    updateCartCount();
    toggleCart();
    alert(" Pedido enviado! Aguarde o contato.");
}

// Verificar horário
function checkStoreStatus() {
    let hour = new Date().getHours();
    let status = document.getElementById("storeStatus");
    if (hour >= 18 && hour < 24) {
        status.innerHTML = "🟢 ABERTO PARA PEDIDOS";
        status.style.color = "var(--success)";
    } else {
        status.innerHTML = "🔴 FECHADO NO MOMENTO (ABRE ÀS 18h)";
        status.style.color = "var(--primary)";
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', function () {
    renderProducts();
    renderCart();
    updateCartCount();
    checkStoreStatus();
    document.getElementById("bairro").addEventListener("change", updateTotals);
});