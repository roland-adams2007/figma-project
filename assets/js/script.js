const open_offcanvas = document.querySelector('#open-offcanvas'),
close_offcanvas = document.querySelector('#close-offcanvas'),
offcanvas = document.querySelector('#offcanvas');

open_offcanvas.addEventListener('click',()=>{
    offcanvas.classList.remove('hidden');
    offcanvas.classList.add('block');
});
close_offcanvas.addEventListener('click',()=>{
    offcanvas.classList.remove('block');
    offcanvas.classList.add('hidden');
});

const searchMedicine = document.getElementById('searchMedicine');
const medicineMenu = document.getElementById('medicine-menu');
const loaders = document.getElementsByClassName('loader');  
const medicineMenuBody = document.getElementById('medicine_menu_body');
const closeMedicineMenu = document.getElementById('close-medicine-menu');
const medicineNameMenu = document.getElementById('medicine-name');
const medicineNameBody = document.getElementById('medicine_name_body');
const closeMedicineName = document.getElementById('close-medicine-name');
const searchMedicineName=document.getElementById('searchMedicineName');

let toggleMedicineMenu = false;
let toggleMedicineNameMenu = false;



searchMedicine.addEventListener('focus', async () => {
    showLoader(true);
    toggleMedicineMenu = true;
    toggleMenu(toggleMedicineMenu, medicineMenu);

    const medicineBrands = await getMedicineBrand();
    showLoader(false);

    medicineMenuBody.innerHTML = '';

    medicineBrands.forEach(medicine => {
        let anchor = document.createElement('a');
        anchor.textContent = medicine.name;
        anchor.id = `medicine-${medicine.id}`;
        anchor.href = '#';

        anchor.addEventListener('click', async (e) => {
            e.preventDefault();
            const id = anchor.id.split('-')[1];
            searchMedicine.value = medicine.name;
            toggleMedicineMenu = false;
            toggleMenu(toggleMedicineMenu, medicineMenu);

         
            const medicineNames = await getMedicineName(id);
            medicineNameBody.innerHTML = '';
            showLoader(true);
            toggleMedicineNameMenu = true;
            toggleMenu(toggleMedicineNameMenu, medicineNameMenu);

            medicineNames.forEach(medicine => {
                let medicineAnchor = document.createElement('a');
                medicineAnchor.textContent = medicine.medicine_name;
                medicineAnchor.id = `medicine-${medicine.medicine_id}`;
                medicineAnchor.href = '#';

                medicineAnchor.addEventListener('click',(e)=>{
                    e.preventDefault();
                    searchMedicineName.value=medicine.medicine_name;
                    toggleMedicineNameMenu = false;
                toggleMenu(toggleMedicineNameMenu, medicineNameMenu);
                })

                medicineNameBody.appendChild(medicineAnchor);
            });

            showLoader(false);
        });

        medicineMenuBody.appendChild(anchor);
    });
});

closeMedicineMenu.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMedicineMenu = false;
    toggleMenu(toggleMedicineMenu, medicineMenu);
});

closeMedicineName.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMedicineNameMenu = false;
    toggleMenu(toggleMedicineNameMenu, medicineNameMenu);
});

function toggleMenu(isVisible, menuElement) {
    if (isVisible) {
        menuElement.classList.remove('hidden');
        menuElement.classList.add('block');
    } else {
        menuElement.classList.remove('block');
        menuElement.classList.add('hidden');
    }
}

function showLoader(show) {
    Array.from(loaders).forEach(loader => {
        if (show) {
            loader.classList.remove('hidden');
            loader.classList.add('block');
        } else {
            loader.classList.remove('block');
            loader.classList.add('hidden');
        }
    });
}

async function getMedicineBrand() {
    try {
        const response = await fetch('https://cliniqueplushealthcare.com.ng/prescriptions/drug_class');
        return await response.json();
    } catch (error) {
        console.error('Error fetching medicine brands:', error);
        return [];
    }
}

async function getMedicineName(medicineClassId) {
    try {
        const response = await fetch(`https://cliniqueplushealthcare.com.ng/prescriptions/get_drug_class_by_id/${medicineClassId}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching medicine names:', error);
        return [];
    }
}


const storedMedicines = localStorage.getItem('medicines');
const medicines = storedMedicines ? JSON.parse(storedMedicines) : [];

function renderMedicines() {
    const tbody = document.getElementById('medicine-tbody');
    tbody.innerHTML = '';

    if (medicines.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="7" style="text-align: center;">No drugs yet</td>`;
        tbody.appendChild(emptyRow);
    } else {
        medicines.forEach((medicine, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${medicine.searchMedicineName}</td>
                <td>${medicine.searchMedicine}</td>
                <td>${medicine.interval}</td>
                <td>${medicine.duration.input}/${medicine.duration.select}</td>
                <td>${medicine.instruction}</td>
                <td><button class="delete-button" data-index="${index}">Delete</button></td>
            `;

            tbody.appendChild(row);
        });
    }
}


renderMedicines();


document.getElementById('add-button').addEventListener('click', (e) => {
    e.preventDefault();
    
    const searchMedicineName = document.getElementById('searchMedicineName').value;
    const searchMedicine = document.getElementById('searchMedicine').value;
    const interval = document.getElementById('interval').value;
    const instruction = document.getElementById('instruction').value;
    const durationSelect = document.getElementById('duration-select').value;
    const durationInput = document.getElementById('duration-input').value;

    if (!searchMedicineName || !searchMedicine || !interval || !instruction || !durationSelect || !durationInput) {
        alert('Please fill in all fields');

      return;
    }

    console.log('Search Medicine Name:', searchMedicineName);
    console.log('Search Medicine:', searchMedicine);
    console.log('Interval:', interval);
    console.log('Instruction:', instruction);
    console.log('Duration Select:', durationSelect);
    console.log('Duration Input:', durationInput);

    const medicine = {
        searchMedicineName,
        searchMedicine,
        interval,
        instruction,
        duration: {
            select: durationSelect,
            input: durationInput
        }
    };

    medicines.push(medicine);

    localStorage.setItem('medicines', JSON.stringify(medicines));

    renderMedicines()

    document.getElementById('searchMedicineName').value = '';
    document.getElementById('searchMedicine').value = '';
    document.getElementById('interval').value = '';
    document.getElementById('instruction').value = '';
    document.getElementById('duration-select').value = '';
    document.getElementById('duration-input').value = '';

});

const donePrescriptionMenu = document.getElementById('done-prescription-menu');
const donePrescriptionMenuBtn = document.getElementById('done-prescription-menu-btn');

donePrescriptionMenuBtn.addEventListener('click',()=>{
donePrescriptionMenu.classList.toggle('hidden');
})