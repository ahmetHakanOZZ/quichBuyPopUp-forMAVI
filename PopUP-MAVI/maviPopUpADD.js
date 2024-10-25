class addPopUp {
    constructor() {
        this.style = document.querySelector('style');
        this.cheapItems = [];
        this.items = document.querySelectorAll('.product-item'); //lcw .product-card
        this.expectedPrice = null;
        this.buildFilter();
        this.ifNewProductsAdd();
        this.add();
        this.initResizeListener();
        
    }

    add = () => {
        this.input = document.querySelector('.filterInput');

        this.input.addEventListener('input', () => {
            this.removeOldPopUps();
            this.cheapItems = [];
            this.expectedPrice = parseFloat(this.input.value) || 0; 
            this.filterItems(); 
        });
    }
    
    filterItems = () => {
        this.items.forEach(item => {
            if (item.popUp) {
                return;
            }

            let itemPrices = item.querySelector('.price').textContent;
            itemPrices = itemPrices.replace(/[^0-9,]/g, '');
            itemPrices = itemPrices.replace(',', '.');
            const price = parseFloat(itemPrices);

            if (price <= this.expectedPrice) {
                this.cheapItems.push(item);
            }
        });
        //console.log(this.cheapItems);
        this.cheapItemsPopupAdd();
        this.initResizeListener();
    }

    removeOldPopUps = () => {
        this.items.forEach(item => {
            if (item.popUp) {
                document.body.removeChild(item.popUp); 
                delete item.popUp;
            }
        });
    }

    cheapItemsPopupAdd = () => {
        this.cheapItems.forEach(item => {
            if (item.popUp) {
                return; 
            }
    
            this.buildPopUp(item); 
            let popUp = item.popUp;
            let nextItem = item.nextElementSibling;
            let beforeItem = item.previousElementSibling;
            let leftGap = 0;
            let rightGap = 0;
    
            let isHoveredItem = false;
            let isHoveredPopup = false;
            // hızlı mouse hareketlerini kontrol etmek için Debounce
            function debounce(func, delay) {
                let timer;
                return function(...args) {
                    clearTimeout(timer);
                    timer = setTimeout(() => func.apply(this, args), delay);
                };
            }
    
            item.addEventListener('mouseover', () => {
                isHoveredItem = true;
                setTimeout(() => {
                    if (isHoveredItem) {
                        popUp.style.display = 'flex'; 
                        popUp.style.opacity = '0'; 
    
                        setTimeout(() => {
                            popUp.style.opacity = '0.9'; 
                        }, 10); 
    
                        const rect = item.getBoundingClientRect();
                        popUp.style.top = `${rect.top + window.scrollY}px`;
    
                        if (beforeItem) {
                            let beforeRect = beforeItem.getBoundingClientRect();
                            leftGap = rect.left - beforeRect.right;
                        }
    
                        if (nextItem) {
                            let nextRect = nextItem.getBoundingClientRect(); 
                            rightGap = nextRect.left - rect.right;
                        }
    
                        if (leftGap > 0) { 
                            popUp.style.left = `${rect.left - item.offsetWidth - leftGap}px`; 
                        } else {
                            popUp.style.left = `${rect.right + rightGap}px`; 
                        }
                    }
                }, 300); 
            });
    
            popUp.addEventListener('mouseenter', () => {
                isHoveredPopup = true;
            });
    
            item.addEventListener('mouseleave', debounce(() => {
                isHoveredItem = false;
                setTimeout(() => {
                    if (!isHoveredPopup && !isHoveredItem) {
                        popUp.style.opacity = '0'; 
                        setTimeout(() => popUp.style.display = 'none', 300); 
                    }
                }, 400); 
            }, 100));
    
            popUp.addEventListener('mouseleave', debounce(() => {
                isHoveredPopup = false;
                setTimeout(() => {
                    if (!isHoveredPopup && !isHoveredItem) {
                        popUp.style.opacity = '0'; 
                        setTimeout(() => popUp.style.display = 'none', 300); 
                    }
                }, 400); 
            }, 100));
        });
    }

    buildFilter = () => {
        let exsistingFilterInput = document.querySelector('.filterInput');

        if(exsistingFilterInput){
            return;
        }
        let filterList = document.querySelector('.filter-list');
        let filterDiv = document.createElement('div');
        filterDiv.classList.add('filter-item');
        let filterInput = document.createElement('input');
        filterInput.classList.add('filterInput');
        filterInput.placeholder = 'Fiyat';
        let filterButton = document.createElement('button');
        filterButton.classList.add('filterButton')
        filterDiv.appendChild(filterInput);
        filterDiv.appendChild(filterButton);
        filterList.appendChild(filterDiv);

        this.filterCss = 
        `
            .filterInput{
                width: 100px;
                height: 40px; 
                border: 1px solid #cccccc;
                border-radius: 3px;
                font-size: 12px;
                font-family: sans-serif;
                padding-left: 8px; /* input placeholder ve value eğer daha da solda olsun diye*/
            }
            .filterButton{
                position: relative;
                left: -20px;
                background-color: #cccccc;
                border-radius: 100%;
                width: 12px;
                height: 12px;
                cursor: pointer;
            }   
            @media (max-width: 767px) {
                .filterInput{
                    margin-left: 14px;
                }
            } 
        `

        if (!this.style) {
            this.newStyle = document.createElement('style');
            this.newStyle.innerHTML = this.filterCss;
            document.head.appendChild(this.newStyle);
            this.style = this.newStyle;
        } 
        else if (!this.style.innerHTML.includes('.filterInput')) {
            this.style.innerHTML += this.filterCss; 
        }

    }

    buildPopUp = (item) => {
        let itemPrice = item.querySelector('.price').textContent;
        let itemImg = item.querySelector('.product-card-images img'); //lcw a .product-image
        let itemRect = itemImg.getBoundingClientRect();
        let popUp = document.createElement('div');
        let cheapInfo = document.createElement('div');
        popUp.classList.add('popUp');
        cheapInfo.classList.add('info');
        popUp.innerHTML = `
            <div class="productPrice productInfo">
                <span>${itemPrice}</span>
            </div>
            <div class="productSeller productInfo">
                Satıcı: <span>Defacto</span>
            </div>
            <div class="productColors productInfo">
                Renk'ler: <button class="chooseButton">Siyah</button> <button class="chooseButton">Beyaz</button> 
            </div>
            <div class="productSizes productInfo">Beden:
            </div>
            <div class="productInfoLine"></div>
            <div class="chooseSizeDiv">
                <button class="chooseButton">XS</button>
                <button class="chooseButton">S</button>
                <button class="chooseButton">M</button>
                <button class="chooseButton">L</button>
                <button class="chooseButton">XL</button>
                <button class="chooseButton">XXL</button>
            </div>
            <button class="buyButton">Satın AL</button>
        `;

        this.css = `
            .popUp {
                overflow: hidden;
                z-index: 8 !important;
                width: ${itemRect.width}px;
                height: ${itemRect.height}px;
                position: absolute;
                background: linear-gradient(
                to left, 
                rgba(3, 70, 123, 0.3),  /* Açık mavi ton */
                rgba(3, 70, 123, 0.7) 50%,  /* Orta yoğunlukta mavi */
                rgba(3, 70, 123, 1) 100%   /* Tam mavi */
                );
                display: none;
                flex-direction: column;
                opacity: 0.9;
                transition: opacity 0.3s ease;
                box-shadow: 
                    rgba(50, 50, 93, 0.25) 0px 60px 120px -10px, 
                    rgba(0, 0, 0, 0.3) 0px 40px 80px -20px,      
                    rgba(10, 37, 64, 0.35) 0px -2px 8px 0px inset;
            }
            .buyButton {
                width: 7vw;
                height: 4vh;
                font-family: sans-serif;
                position: absolute;
                text-align: center;
                left: 50%;
                transform: translateX(-50%);
                overflow: hidden;
                font-size: 1vw;
                bottom: 2vh;
                background-color: #03467b;
                color: white;
                border: 0px;
                border-radius: 9px;
                cursor: pointer;
                color: #cccbcb;
            }
            
            .productInfo{
                font-family: sans-serif;
                position: relative;
                left: 2vw;
                color: #cccbcb;
                margin-top: 3vh;
                opacity: 1;
                padding: 0 1vw;
            }

            .productPrice{
                font-weight: bold;
                font-size: 20px;
            }

            .productInfoLine{
                background-color: #03467b; 
                position: relative;
                left: 50%;
                transform: translateX(-50%);
                height: 1px;
                width: 15vw;
                margin: 5px 0;
            }

            .chooseSizeDiv {
                display: flex;  
                align-items: center;            
                flex-wrap: wrap;             
                gap: 8px;                    
                margin: 0 3vw;           
                margin-top: 1vh;             
                max-width: 100%;             
            }

            .chooseButton {  
                background-color: #f0f0f0;   
                cursor: pointer;  
            }

            /* .infoSpan {
                font-family: sans-serif;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
                color: #cccbcb;
                top: 3vh;
                opacity: 1;
                padding: 0 1vw;
            } */

            @media (max-width: 490px) {
                
                .productInfo{
                    margin-top: 1.7vh;
                    font-size: 2.5vw;
                }

                .buyButton {
                    width: 12vw;
                    height: 2.5vh;
                    font-size: 2vw;
                }
                .chooseButton{  
                    width: 8vw;
                    height: 1.8vh;
                    font-size: 2vw;
                }
                
            }

            @media (min-width: 490px) and (max-width: 590px) {
            
                .productInfo{
                    margin-top: 2vh;
                    font-size: 2.2vw;
                }

                .buyButton {
                    width: 10vw;
                    height: 4vh; 
                    font-size: 1.8vw;
                }

            }

            @media (min-width: 591px) and (max-width: 767px) {
                .buyButton {
                    width: 22vw;
                    height: 6vh; 
                    font-size: 2.5vw;
                }

                .productInfo{
                    font-size: 3vw;
                }
                
                .chooseButton{  
                    width: 8vw;
                    height: 2.5vh;
                }

                .productInfoLine{
                    width: 25vw;
                }
            }

            @media (min-width: 768px) and (max-width: 940px) {
                .buyButton {
                    width: 7vw;
                    height: 4vh; 
                    font-size: 1.4vw;
                }

                .productInfo{
                    font-size: 1.5vw;
                    margin-top: 2vh;
                }
                
            }

            @media (min-width: 940px) {
                .buyButton {
                    width: 10vw;
                    height: 5vh; 
                    font-size: 1.2vw;
                }
                .infoSpan{
                    font-size: 1.6vw;
                }
                .chooseButton{  
                    width: 5vw;
                    height: 2.5vh;
                }
            }
        `;

        if (!this.style) {
            this.newStyle = document.createElement('style');
            this.newStyle.innerHTML = this.css;
            document.head.appendChild(this.newStyle);
            this.style = this.newStyle;
        } 
        else if (!this.style.innerHTML.includes('.popUp')) {
            this.style.innerHTML += this.css; 
        }
        
        const button = popUp.querySelector('.buyButton'); 
        const span = popUp.querySelector('.infoSpan');
        
        item.popUp = popUp;
        item.popUp.span = span;   // item ile tanımlama sayesinde heryerden erişeilebilir kılmış olduk 
        item.popUp.button = button;
        item.style.width = item.width;
        document.body.appendChild(popUp);
    }

    initResizeListener = () => {
        console.log(this.cheapItems);
        this.cheapItems.forEach(item => {
            let itemImg = item.querySelector('.product-card-images img'); //lcw a .product-image
            console.log(itemImg)
            if (itemImg) {

                const observer = new ResizeObserver(entries => {
                    entries.forEach(entry => {
                        const rect = entry.contentRect;
    
                        if (item.popUp) {
                            console.log(item.popUp);
                            item.popUp.style.width = `${rect.width}px`;
                            item.popUp.style.height = `${rect.height}px`;
                            //item.popUp.style.left = `${rect.left - rect.width}px`
                        }
                    });
                });
    
                observer.observe(itemImg);
            } else {
                console.log('itemImg bulunamadı');
            }
        });
    }
    ifNewProductsAdd = ()=>{
        this.productList = document.querySelector('.product-list-cards-inner');
        if(this.productList){
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation=>{
                    if(mutation.type === "childList"){
                        console.log('Calıştı');
                        this.items = document.querySelectorAll('.product-item'); //lcw .product-card
                        //this.add();
                        if (this.expectedPrice !== null) {
                            this.filterItems(); // eğer yeni ürünler eklenirse filtreleme
                        }
                    }
                })
            });
            let config = { childList: true };
            observer.observe(this.productList, config);
        }
    }
    
}

const popup = new addPopUp();
