(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  const closeMenu = (restoreFocus = false) => {
    nav.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'メニューを開く');
    document.body.classList.remove('menu-open');
    if (restoreFocus) menu.focus();
  };
  menu.addEventListener('click', () => {
    if (menu.getAttribute('aria-expanded') === 'true') return closeMenu();
    nav.classList.add('is-open');
    menu.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-label', 'メニューを閉じる');
    document.body.classList.add('menu-open');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(true);
    if (e.key === 'Tab' && nav.classList.contains('is-open')) {
      const links = [...document.querySelectorAll('.header a,.header button,#site-nav a')].filter(el => el.getClientRects().length);
      const first = links[0], last = links[links.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  window.matchMedia('(min-width:901px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
  const motion = document.querySelector('#motion-toggle');
  motion.addEventListener('click', () => {
    const paused = document.documentElement.classList.toggle('motion-paused');
    motion.setAttribute('aria-pressed', String(paused));
    motion.textContent = paused ? '動きを再開する' : '動きを停止する';
  });
  const entryDialog = document.querySelector('#entry-dialog');
  const personDialog = document.querySelector('#person-dialog');
  const showDialog = dialog => {
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  };
  document.querySelectorAll('[data-entry]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelector('#entry-role').textContent = button.dataset.entry;
      showDialog(entryDialog);
    });
  });
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelectorAll('.dialog-close,.dialog-dismiss').forEach(button => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
  });
  const openJob = id => {
    const job = document.getElementById(id);
    if (job instanceof HTMLDetailsElement) job.open = true;
  };
  document.querySelectorAll('[data-job-target]').forEach(link => link.addEventListener('click', () => openJob(link.dataset.jobTarget)));
  const stories = {
    sales: {title:'「聞くこと」が、いちばんの提案になる。',role:'営業・企画提案',job:'job-sales',paragraphs:['「何を提案するか」より前に、「何を大切にしているか」を知りたい。お客様がふと口にした一言に、まだ見えていなかった課題のヒントがあるかもしれません。','そんな気づきをチームに持ち帰り、企画や運用の仲間と一緒に考える。相手の想いが少しずつ形になる過程に、仕事のおもしろさがある。そんな働き方を描いたストーリーです。']},
    planner: {title:'小さなひらめきを、誰かに届くアイデアへ。',role:'マーケティング・企画',job:'job-planner',paragraphs:['街で目にした広告も、つい見続けてしまった投稿も。「なぜ心が動いたんだろう」と考えてみる。その好奇心が、企画の出発点になります。','お客様が伝えたいことと、見る人が知りたいこと。その間にある接点を探し、言葉やコンテンツに変えていく。試した結果から学ぶ過程も含めて楽しむ、そんな仕事をイメージしています。']},
    support: {title:'「相談してよかった」を、一つずつ増やしたい。',role:'カスタマーサポート',job:'job-support',paragraphs:['うまく説明できない困りごとも、話しているうちに整理できることがあります。まずは安心して話せる相手になる。それがサポートの第一歩です。','届いた声を社内の仲間に共有して、次の改善につなげる。一つの相談から、もっと使いやすいサービスが生まれる。人とのつながりを育てる仕事の、モデルストーリーです。']}
  };
  document.querySelectorAll('[data-person]').forEach(button => button.addEventListener('click', () => {
    const story = stories[button.dataset.person];
    document.querySelector('#person-title').textContent = story.title;
    document.querySelector('#person-role').textContent = story.role;
    const container = document.querySelector('#person-story');
    container.replaceChildren(...story.paragraphs.map(text => { const p = document.createElement('p'); p.textContent = text; return p; }));
    const jobLink = document.querySelector('#person-job');
    jobLink.href = '#' + story.job;
    jobLink.dataset.jobTarget = story.job;
    showDialog(personDialog);
  }));
  document.querySelector('#person-job').addEventListener('click', event => {
    openJob(event.currentTarget.dataset.jobTarget);
    personDialog.close();
  });
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); }
  }), { threshold:0.08 });
  document.querySelectorAll('.reveal').forEach(element => reveal.observe(element));
  if (location.hash) openJob(location.hash.slice(1));
  window.addEventListener('hashchange', () => openJob(location.hash.slice(1)));
})();
