/* 共用播放音量：PV、本機影音及 YouTube 使用相同設定。 */
(() => {
  const KEY = 'lyricfx:volume';
  window.PlayerVolume = {
    bind(media){
      let saved;
      try{ saved = JSON.parse(localStorage.getItem(KEY)); }catch{}
      let volume = typeof saved?.volume === 'number' && Number.isFinite(saved.volume)
        ? Math.min(100, Math.max(0, saved.volume)) : 100;
      let muted = saved?.muted === true;
      let lastVolume = volume || 100;
      const slider = document.getElementById('volume');
      const button = document.getElementById('mute');
      const value = document.getElementById('volumeValue');
      let youtube = null;
      function syncYouTube(player = youtube){
        youtube = player;
        if(!player) return;
        player.setVolume(volume);
        if(muted || volume === 0) player.mute();
        else player.unMute();
      }
      function sync(){
        const silent = muted || volume === 0;
        slider.value = volume;
        slider.setAttribute('aria-valuetext', `${volume}%${muted ? '（靜音）' : ''}`);
        value.textContent = `${silent ? 0 : volume}%`;
        button.textContent = silent ? '🔇' : '🔊';
        button.title = silent ? '取消靜音' : '靜音';
        button.setAttribute('aria-label', button.title);
        button.setAttribute('aria-pressed', String(silent));
        if(volume > 0) lastVolume = volume;
        syncYouTube();
        try{ localStorage.setItem(KEY, JSON.stringify({volume, muted})); }catch{}
      }
      function apply(){
        media.volume = volume / 100;
        media.muted = muted;
        sync();
      }
      slider.disabled = button.disabled = false;
      slider.addEventListener('input', () => {
        volume = Number(slider.value);
        muted = false;
        apply();
      });
      button.addEventListener('click', () => {
        if(volume === 0){ volume = lastVolume; muted = false; }
        else muted = !muted;
        apply();
      });
      media.addEventListener('volumechange', () => {
        volume = Math.round(media.volume * 100);
        muted = media.muted;
        sync();
      });
      apply();
      return {syncYouTube};
    }
  };
})();
