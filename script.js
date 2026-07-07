const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
const toast=(m)=>{const t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1600)};
window.addEventListener("load",()=>setTimeout(()=>$("#loader").classList.add("hide"),1500));
window.addEventListener("scroll",()=>{$("#progress").style.width=(scrollY/(document.documentElement.scrollHeight-innerHeight))*100+"%"});
$("#hamburger").onclick=()=>$("#nav").classList.toggle("open");
$$("nav a").forEach(a=>a.onclick=()=>$("#nav").classList.remove("open"));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("on")}),{threshold:.12});
$$(".reveal").forEach(el=>io.observe(el));

const details={editing:[["1인 1절",5000],["1인 완곡",10000],["2인 완곡",20000],["3인 합창",25000]],harmony:[["카피화음 1절",6000],["카피화음 완곡",12000],["창작화음 1절",3000],["창작화음 완곡",8000]],artificial:[["인공화음 1절",5000],["인공화음 완곡",10000]]};
const names={editing:"보컬 에디팅",harmony:"화음 가이드",artificial:"인공 화음 가이드"};
const count={people:0,track:0,htrack:0};
const won=n=>n.toLocaleString("ko-KR")+"원";
function update(){let lines=[],total=0,svc=$("#service").value,opt=$("#detail").selectedOptions[0];if(svc&&opt&&opt.value){let p=+opt.value;total+=p;lines.push([names[svc]+" - "+opt.dataset.name,p])}if(count.people){let p=count.people*10000;total+=p;lines.push(["에디팅 인원 추가 x"+count.people,p])}if(count.track){let p=count.track*3000;total+=p;lines.push(["트랙 추가 x"+count.track,p])}if(count.htrack){let p=count.htrack*3000;total+=p;lines.push(["화음 트랙 추가 x"+count.htrack,p])}let rush=+$("input[name=rush]:checked").value;if(rush){total+=rush;lines.push([rush===5000?"3일 빠른마감":"1일 빠른마감",rush])}$("#lines").innerHTML=lines.length?lines.map(l=>`<div class="line"><span>${l[0]}</span><b>${won(l[1])}</b></div>`).join(""):"<p class='hint'>옵션을 선택하면 견적이 표시됩니다.</p>";$("#total").textContent=won(total);$("#copy").disabled=!$("#agree").checked||!svc||!opt?.value}
$("#service").onchange=()=>{const v=$("#service").value;$("#detail").innerHTML="";if(!v){$("#detail").innerHTML="<option value=''>의뢰 종류를 먼저 선택</option>";update();return}details[v].forEach(([n,p])=>{let o=document.createElement("option");o.value=p;o.dataset.name=n;o.textContent=`${n} / ${won(p)}`;$("#detail").append(o)});update()};
$("#detail").onchange=update;$("#agree").onchange=update;$$("input[name=rush]").forEach(x=>x.onchange=update);
$$("[data-key]").forEach(b=>b.onclick=()=>{let k=b.dataset.key;count[k]=Math.max(0,count[k]+(+b.dataset.step));$("#"+k).textContent=count[k];update()});
$$("input[name=platform]").forEach(c=>c.onchange=()=>{$("#platformInputs").innerHTML="";$$("input[name=platform]:checked").forEach(i=>{let l=document.createElement("label");l.textContent=i.value+" 아이디/링크";l.innerHTML+=`<input data-pinput="${i.value}" placeholder="${i.value} 연락처">`;$("#platformInputs").append(l)})});
$("#copy").onclick=async()=>{const svc=$("#service").value,opt=$("#detail").selectedOptions[0];const ps=$$("[data-pinput]").map(i=>`${i.dataset.pinput}: ${i.value||"(미작성)"}`).join("\n")||"(미작성)";const rec=$$("input[name=record]:checked").map(i=>i.value).join(", ")||"(미작성)";const rush=$("input[name=rush]:checked").parentElement.textContent.trim();const text=`안녕하세요! RUYA Studio 의뢰 문의드립니다.

■ 활동명
${$("#name").value||"(미작성)"}

■ 연락 가능한 플랫폼
${ps}

■ 의뢰 종류
${names[svc]||"(미선택)"}

■ 세부 옵션
${opt?.dataset.name||"(미선택)"}

■ 추가 옵션
에디팅 인원 추가: ${count.people}
트랙 추가: ${count.track}
화음 트랙 추가: ${count.htrack}

■ 빠른 마감
${rush}

■ 녹음 환경
${rec}

■ 작업 설명
${$("#memo").value||"(미작성)"}

■ 예상 금액
${$("#total").textContent}`;await navigator.clipboard.writeText(text);toast("의뢰서가 복사됐어요!")};
$$(".tabs button").forEach(t=>t.onclick=()=>{$$(".tabs button").forEach(x=>x.classList.remove("active"));t.classList.add("active");let f=t.dataset.filter;$$(".video").forEach(v=>v.style.display=f==="all"||v.dataset.category===f?"":"none")});
$$(".video").forEach(v=>v.onclick=()=>{$("#player").src=`https://www.youtube.com/embed/${v.dataset.id}?autoplay=1`;$("#modal").classList.add("show")});
$("#close").onclick=()=>{$("#modal").classList.remove("show");$("#player").src=""};
$("#discord").onclick=async()=>{await navigator.clipboard.writeText("rotchan");toast("Discord ID 복사됨: rotchan")};
update();