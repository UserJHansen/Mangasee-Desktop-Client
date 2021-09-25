import React from 'react';
import { NavLink, Link, useHistory } from 'react-router-dom';
import useSWR from 'swr';
import { decode } from 'he';
import Fuse from 'fuse.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faSearch,
  faComments,
  faFolder,
  faRss,
  faThumbtack,
  faCog,
  faSignOutAlt,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import {
  Navbar as BSNavbar,
  Container,
  Nav,
  NavDropdown,
  Row,
  Col,
  InputGroup,
  FormControl,
} from 'react-bootstrap';

import Authentication from '../APIs/Authentication';
import Store from '../APIs/storage';
import MangaReturn from '../Interfaces/MangaReturn';

import CSS from './navbarflex.module.scss';

export default function Navbar() {
  const { data: SearchableList } = useSWR('/api/SearchableList');
  const history = useHistory();
  const [searchTerm, setSearchTerm] = React.useState('');

  const fuse = React.useMemo(
    () =>
      new Fuse(SearchableList || [], {
        keys: [
          { name: 's', weight: 0.9 },
          { name: 'a', weight: 0.1 },
        ],
        threshold: 0.3,
      }),
    [SearchableList]
  );

  const results: Fuse.FuseResult<MangaReturn>[] = fuse.search(searchTerm);

  function quickSearchSubmit() {
    if (results.length === 1) {
      history.push(`/manga/${results[0].item.i}`);
    } else {
      history.push(`/search/?name=${searchTerm}`);
    }
    setSearchTerm('');
  }

  return (
    <>
      <BSNavbar
        style={{ backgroundColor: '#2b2b2b' }}
        expand="lg"
        variant="dark"
      >
        <Container>
          <Row className="align-items-center" style={{ width: 'inherit' }}>
            <Col lg={8} md={7}>
              <Link to="/home">
                <img
                  alt="Mangasee Logo"
                  src="https://mangasee123.com/media/navbar.brand.png"
                  className="d-inline-block"
                />
              </Link>
            </Col>
            <Col
              lg={4}
              md={5}
              className={CSS.QuickSearch}
              style={{ position: 'relative' }}
            >
              <InputGroup>
                <FormControl
                  type="text"
                  placeholder="Quick Search..."
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(event.target.value)
                  }
                  value={searchTerm}
                  onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === 'Enter') quickSearchSubmit();
                  }}
                />
                <InputGroup.Text onClick={() => quickSearchSubmit()}>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
              </InputGroup>
              {(() => {
                if (searchTerm.length > 1)
                  return results.length === 0 ? (
                    <div
                      className={CSS.SearchResult}
                      style={{ padding: 10, color: 'black' }}
                    >
                      No Results
                    </div>
                  ) : (
                    <div className={CSS.SearchResult}>
                      {results
                        .slice(0, 10)
                        .map((manga: Fuse.FuseResult<MangaReturn>) => (
                          <Link
                            key={manga.item.i}
                            to={`/manga/${manga.item.i}`}
                            className={CSS.SearchLink}
                            onClick={() => setSearchTerm('')}
                          >
                            <img
                              alt="Cover"
                              src={`https://cover.nep.li/cover/${manga.item.i}.jpg`}
                            />
                            <div className={CSS.SearchResultLabel}>
                              {decode(manga.item.s)}
                            </div>
                          </Link>
                        ))}
                    </div>
                  );
                return <></>;
              })()}
            </Col>
          </Row>
        </Container>
      </BSNavbar>
      <BSNavbar
        style={{ backgroundColor: '#444', top: -1 }}
        variant="dark"
        collapseOnSelect
        expand="lg"
        sticky="top"
        id="SmallerNav"
      >
        <Container>
          <BSNavbar.Toggle
            aria-controls="bottom-nav"
            className="justify-content-end"
          />
          <BSNavbar.Collapse id="bottom-nav">
            {[
              ['Home', faHome],
              ['Directory', faFolder],
              ['Search', faSearch],
              ['Discussion', faComments],
            ].map((object) => {
              return (
                <NavLink
                  to={`/${object[0] as string}`}
                  className={CSS.navitem}
                  activeClassName={CSS.active}
                  key={object[0] as string}
                >
                  <FontAwesomeIcon icon={object[1] as IconDefinition} />
                  {` ${object[0] as string}`}
                </NavLink>
              );
            })}
          </BSNavbar.Collapse>
          <Nav className="justify-content-end">
            <NavDropdown title="Account" id="account-dropdown">
              {[
                ['Subscriptions', faRss],
                ['Bookmarks', faThumbtack],
                ['Settings', faCog],
              ].map((object) => {
                return (
                  <NavLink
                    to={`/${object[0] as string}`}
                    activeClassName={CSS.active}
                    key={object[0] as string}
                    className="dropdown-item"
                  >
                    <FontAwesomeIcon icon={object[1] as IconDefinition} />
                    {` ${object[0] as string}`}
                  </NavLink>
                );
              })}
              <NavDropdown.Item onClick={Authentication.logout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                {' Logout'}
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </BSNavbar>
    </>
  );
}
