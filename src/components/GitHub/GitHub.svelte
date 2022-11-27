<script lang="ts">
    const logoURL = "./img/GitHub-Mark-64px.png"

    const repoURL = "https://github.com/IsraPerez98/app-titulo";

    function onClickAbrir() {
        window.open(repoURL, "_blank");
    }
</script>

<div class="absolute bottom-0 left-0 pointer-events-auto ">
    <div class="bg-indigo-700/95 dark:bg-white/80 backdrop-blur border border-slate-600/40 shadow-xl rounded-full w-10 h-10 ml-4 mb-4">
        <button 
            on:click={onClickAbrir} 
            title={'Repositorio de GitHub'}
            
            class="w-full h-full flex items-center justify-center"
        >
            <img alt="GitHub" src={logoURL} class="w-6 h-6 invert dark:invert-0" />
        </button>
    </div>
</div>