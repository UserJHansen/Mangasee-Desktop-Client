import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import TimeAgo from 'react-timeago';

import {
  faCheckCircle,
  faFireAlt,
  faRss,
} from '@fortawesome/free-solid-svg-icons';
import { faClock, faFile } from '@fortawesome/free-regular-svg-icons';
import CSS from './card.module.scss';

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
    <Col lg={2} md={4} sm={5} xs={12} className={CSS.box}>
      <Link to={link} title={title} style={{ color: '#fff' }}>
        <img className={CSS.image} src={src} alt="Cover" />
        <div className={CSS.overlay}>
          <span className={CSS.text}>{text}</span>
        </div>
      </Link>
    </Col>
  );
}

export function WideCard({ manga, subArr, hotArr }: WideCardProps) {
  return (
    <Col md={12} xl={6}>
      <Row className={CSS.largecard}>
        <Col xs={4} className={CSS.largeimage}>
          <Link to={`/manga/${manga.IndexName}`} title={manga.SeriesName}>
            <img
              src={`https://cover.nep.li/cover/${manga.IndexName}.jpg`}
              alt="Cover"
              style={{ maxWidth: '100%' }}
            />
          </Link>
        </Col>
        <Col xs={8} className={CSS.textcontainer}>
          <Link
            to={`/read/${manga.IndexName}${chapterURLEncode(manga.Chapter)}`}
            title={`${manga.SeriesName} Chapter ${ChapterDisplay(
              manga.Chapter
            )}`}
          >
            <div className={CSS.name}>
              {manga.ScanStatus === 'Complete' && (
                <>
                  <FontAwesomeIcon
                    className={CSS.complete}
                    icon={faCheckCircle}
                    title="Complete"
                  />{' '}
                </>
              )}
              {subArr.includes(manga.SeriesID) && (
                <>
                  <FontAwesomeIcon
                    className={CSS.subbed}
                    icon={faRss}
                    title="Subscribed"
                  />{' '}
                </>
              )}
              {hotArr.includes(manga.SeriesID) && (
                <>
                  <FontAwesomeIcon
                    className={CSS.hot}
                    icon={faFireAlt}
                    title="Hot"
                  />{' '}
                </>
              )}{' '}
              {manga.SeriesName}
            </div>
            <div className={CSS.smallertext}>
              <FontAwesomeIcon icon={faFile} /> Chapter{' '}
              {ChapterDisplay(manga.Chapter)}
            </div>
            <div className={CSS.smallertext}>
              <FontAwesomeIcon icon={faClock} /> <TimeAgo date={manga.Date} />
            </div>
          </Link>
        </Col>
      </Row>
    </Col>
  );
}
