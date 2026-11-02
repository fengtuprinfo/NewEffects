// Keep the stored song IDs/indices stable while grouping language versions for display and navigation.
(() => {
  'use strict';
  const languages={英文:1,日文:2,粵文:3};
  const describe=title=>{
    const text=String(title||'').trim(),match=text.match(/[（(](英文|日文|粵文)歌詞[）)]$/);
    return {base:match?text.slice(0,match.index).trim():text,language:match?languages[match[1]]:0};
  };
  function group(items,reference=items){
    const byId=new Map(reference.filter(s=>s.id!=null).map(s=>[s.id,s]));
    const ranks=new Map();
    for(const song of reference){const {base}=describe(song.title);if(!ranks.has(base))ranks.set(base,ranks.size);}
    const entries=items.map((song,index)=>{
      const {base,language}=describe(byId.get(song.id)?.title||song.title);
      if(!ranks.has(base))ranks.set(base,ranks.size);
      return {song,index,rank:ranks.get(base),language};
    });
    return entries.sort((a,b)=>a.rank-b.rank||a.language-b.language||a.index-b.index).map(e=>e.song);
  }
  window.SongOrder={group};
})();
