<template>
    <footer class="w-full h-[50vh] bg-(--bg-color) relative z-9 pt-10 shadow-inner-top">
        <UContainer class="h-full flex md:flex-row flex-col justify-between items-center border-top border-gray-200">

            <div>
                Logo
            </div>
    
            <div>
                <p>Derechos reservados &copy; {{ new Date().getFullYear() }} SYS S.A.S.</p>
            </div>
    
            <div class="flex flex-col items-center">
                <h4>Contacto</h4>
                <UButton color="neutral" variant="link" size="sm" icon="i-lucide-mail">info@sys.com</UButton>
                <UButton color="neutral" variant="link" size="sm" icon="i-lucide-phone">+57 1 234 5678</UButton>
            </div>

        </UContainer>
    </footer>
</template>

<style>
.shadow-inner-top {
  box-shadow: inset 0 5px 10px rgba(0, 0, 0, 0.25);
}
</style>