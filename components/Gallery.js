import React, { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import $ from 'jquery';
import { get } from './request';

function Img({src, handler, index}) {
  return (
    <div className="wrap" onClick={() => handler(index)}>
      <LazyLoadImage src={src} className="photo" effect="blur" />
    </div>
  );
}

function ViewSource({src}) {
  return (
    <a href={src} className="original" onClick={(e) => e.stopPropagation()} target="_blank">
     オリジナル
    </a>
  );
}

function Description({info}) {
  return (
    <div className="photo_info" onClick={(e) => e.stopPropagation()}>
      <span>
        {info}
      </span>
    </div>
  );
}

async function fetchLoli(loli = false, r18 = false) {
  const url = "https://remisiki.herokuapp.com/";
  // const url = "http://192.168.0.112:9000/";
  let args = {
    "size": "regular",
    "num": 15
  };
  if (loli) {
    args.args = "loli";
  }
  if (r18) {
    args.r18 = "1";
  }
  let response = await get(url, args);
  return response;
}

function compress(url) {
  return ("https://i.pixiv.re/c/250x250_80_a2" + url.replace("https://i.pixiv.cat", "").replace("master1200", "square1200"));
}

function compress_phone(url) {
  return ("https://i.pixiv.re/c/540x540_70" + url.replace("https://i.pixiv.cat", ""));
}

function source(url) {
  return ("https://www.pixiv.net/artworks/" + url);
}

function description(info) {
  return (`${info.author} - ${info.title}`);
}

function Refresh() {
  return (<svg viewBox="0 0 512 512" height="16" width="16" fill="#eee" secondaryopacity="0.4" tabIndex="-1"><path d="M464 16c-17.67 0-32 14.31-32 32v74.09C392.1 66.52 327.4 32 256 32C161.5 32 78.59 92.34 49.58 182.2c-5.438 16.81 3.797 34.88 20.61 40.28c16.89 5.5 34.88-3.812 40.3-20.59C130.9 138.5 189.4 96 256 96c50.5 0 96.26 24.55 124.4 64H336c-17.67 0-32 14.31-32 32s14.33 32 32 32h128c17.67 0 32-14.31 32-32V48C496 30.31 481.7 16 464 16zM441.8 289.6c-16.92-5.438-34.88 3.812-40.3 20.59C381.1 373.5 322.6 416 256 416c-50.5 0-96.25-24.55-124.4-64H176c17.67 0 32-14.31 32-32s-14.33-32-32-32h-128c-17.67 0-32 14.31-32 32v144c0 17.69 14.33 32 32 32s32-14.31 32-32v-74.09C119.9 445.5 184.6 480 255.1 480c94.45 0 177.4-60.34 206.4-150.2C467.9 313 458.6 294.1 441.8 289.6z" height="16" width="16" fill="#eee" secondaryopacity="0.4" fillOpacity="1"></path></svg>);
}

function GalleryScreen() {
  const screen_width = window.innerWidth;
  const [state, setState] = useState('out');
  const stateHandler = (state) => {
    setState(state);
  }
  let [lists, setLists] = useState(false);
  let photos = [];
  useEffect(async () => {
    lists = await fetchLoli();
    setLists(lists);
  },[]);
  return (
    <>
      <section id="top">
        <div className="title-left">
          Kガチャ
        </div>
        <div className="wrapper nav-block">
          <div className="right-action-container">
            <div className="title-right-tag" id="tagloli" onClick={() => {
              $("#tagloli").toggleClass("title-tag-selected");
            }}>
              ロリ
            </div>
            <div className="title-right-tag" id="tagr18" onClick={() => {
              $("#tagr18").toggleClass("title-tag-selected");
            }}>
              R18
            </div>
            <div className="title-right" onClick={async () => {
              const loli = ($('#tagloli').hasClass('title-tag-selected'));
              const r18 = ($('#tagr18').hasClass('title-tag-selected'));
              lists = await fetchLoli(loli, r18);
              setLists(lists);
              $('html, body').animate({ scrollTop: 0 }, 'fast');
            }}>
              <Refresh />
            </div>
          </div>
        </div>
      </section>
      <div className="photo_container">
        {lists && lists.data.map((value, index) => {
          if (screen_width <= 425) {
            return <Img src={compress_phone(value.urls.regular)} key={`photo${index}`} handler={stateHandler} index={index} />;
          }
          else {
            return <Img src={compress(value.urls.regular)} key={`photo${index}`} handler={stateHandler} index={index} />;
          }
        })}
      </div>
      {state !== 'out' && 
        <div onClick={() => setState('out')} className="photo_zoom_container">
          <LazyLoadImage src={lists.data.at(state).urls.regular.replace("cat", "re")} className="photo_zoom" effect="blur" />
          <ViewSource src={source(lists.data.at(state).pid)} />
          <Description info={description(lists.data.at(state))} />
        </div>
      }
    </>
  );
}

export default GalleryScreen;