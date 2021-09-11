import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faCheckCircle,
  faFireAlt,
  faRss,
} from '@fortawesome/free-solid-svg-icons';
import { faClock, faFile } from '@fortawesome/free-regular-svg-icons';

import { chapterURLEncode, ChapterDisplay } from './DisplayTools';
import MangaResult from '../Interfaces/MangaResult';

interface ThinCardProps {
  children: Array<string | number> | string;
  link: string;
  title: string;
  src: string;
}

interface WideCardProps {
  manga: MangaResult;
  subArr: string[];
  hotArr: string[];
}

export function ThinCard({ children, link, title, src }: ThinCardProps) {
  let text;
  if (typeof children === 'object') {
    text =
      children.join('').length >= 23
        ? `${children.join('').substring(0, 20)}...${
            /[0-9]+$/.exec(children.join(''))?.[0] || ''
          }`
        : children;
  } else if (typeof children === 'string') {
    text =
      children.length >= 23
        ? `${children.substring(0, 20)}...${
            /[0-9]+$/.exec(children)?.[0] || ''
          }`
        : children;
  } else {
    throw new TypeError('Children Should be a String or an Array');
  }
  return (
    <Col
      lg={2}
      md={4}
      sm={5}
      xs={12}
      style={{
        color: '#fff',
        height: 220,
        padding: 20,
        margin: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Link to={link} title={title} style={{ color: '#fff' }}>
        <img
          style={{
            width: '100%',
            minHeight: 220,
          }}
          src={src}
          alt="Cover"
        />
        <div
          style={{
            background: 'linear-gradient(rgba(0,0,0,.7),rgba(0,0,0,.7))',
            fontSize: 14,
            verticalAlign: 'middle',
            minHeight: 40,
            textShadow: '2px 2px 4px #000',
            padding: 5,
            textAlign: 'center',
            position: 'absolute',
            zIndex: 2,
            right: 20,
            bottom: 0,
            left: 20,
          }}
        >
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              height: 40,
              overflow: 'hidden',
            }}
          >
            {text}
          </span>
        </div>
      </Link>
    </Col>
  );
}

export function WideCard({ manga, subArr, hotArr }: WideCardProps) {
  return (
    <Col md={12} xl={6}>
      <Row
        style={{
          margin: '10px 0 10px 0',
        }}
      >
        <Col
          xs={4}
          style={{
            padding: 0,
            maxWidth: 90,
            height: 90,
            overflow: 'hidden',
          }}
        >
          <Link to={`/manga/${manga.IndexName}`} title={manga.SeriesName}>
            <img
              src={`https://cover.nep.li/cover/${manga.IndexName}`}
              alt="Cover"
            />
          </Link>
        </Col>
        <Col
          xs={8}
          style={{
            padding: '10px 15px',
            background: '#f2f2f2',
            minWidth: 'calc(100% - 90px)',
          }}
        >
          <Link
            to={`/read/${manga.IndexName}${chapterURLEncode(manga.Chapter)}`}
            title={`${manga.SeriesName} Chapter ${ChapterDisplay(
              manga.Chapter
            )}`}
          >
            <div
              style={{
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {manga.ScanStatus === 'Complete' && (
                <FontAwesomeIcon icon={faCheckCircle} title="Complete" />
              )}
              {subArr.includes(manga.SeriesID) && (
                <FontAwesomeIcon icon={faRss} />
              )}
              {hotArr.includes(manga.SeriesID) && (
                <FontAwesomeIcon icon={faFireAlt} />
              )}
              {manga.SeriesName}
            </div>
            <div
              style={{
                color: 'gray',
                fontSize: 14,
              }}
            >
              <FontAwesomeIcon icon={faFile} />
              Chapter {ChapterDisplay(manga.Chapter)}
            </div>
            <div
              style={{
                color: 'gray',
                fontSize: 14,
              }}
            >
              <FontAwesomeIcon icon={faClock} />
              <ReactTimeAgo date={manga.Date} />
            </div>
          </Link>
        </Col>
      </Row>
    </Col>
  );
}
