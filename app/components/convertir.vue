<script setup>
const fileInput = ref([])

async function convertir(event) {
    const files = event.target.files;
    for (const file of files) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            // Exportar a WebP
            canvas.toBlob((blob) => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = file.name.replace(".jpg", ".webp");
                link.click();
            }, "image/webp", 0.9); // calidad 0.9
        };
    }
};
</script>

<template>
    <label for="fileInput" class="text-2xl text-gray-900">eeeeey</label>
    <input placeholder="Seleccione archivos" type="file" id="fileInput" multiple accept="image/jpeg" :onChange="convertir" />
</template>