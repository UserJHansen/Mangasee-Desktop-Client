import React from 'react';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface BoxProps {
  children: string | React.ElementType | JSX.Element;
  width: number;
  icon: IconDefinition;
  title: string;
  style?: Record<string, unknown>;
  rightIcon?: IconDefinition;
  rightText?: string;
  LinkElement?: React.ElementType;
  linkProps?: Record<string, unknown>;
}

export default function Box({
  children,
  width,
  icon,
  title,
  style = {},
  rightIcon = undefined,
  rightText = '',
  LinkElement = undefined,
  linkProps = {},
}: BoxProps) {
  return (
    <Col lg={width}>
      <div style={{ marginTop: '15px', marginBottom: '15px' }}>
        <div
          style={{
            background: '#247D8F',
            padding: '10px 15px',
            color: '#fff',
            fontSize: '18px',
          }}
        >
          <FontAwesomeIcon icon={icon} />
          {` ${title}`}
          {rightIcon && LinkElement ? (
            <LinkElement
              style={{ color: '#fff', textDecoration: 'none', float: 'right' }}
              {...{ to: linkProps.to, onClick: linkProps.onClick }}
            >
              {`${rightText || ''} `}
              <FontAwesomeIcon icon={rightIcon} />
            </LinkElement>
          ) : (
            <></>
          )}
        </div>
        <div
          style={{
            ...{
              background: '#fff',
              color: '#000',
              padding: '10px 15px',
            },
            ...style,
          }}
        >
          {children}
        </div>
      </div>
    </Col>
  );
}

Box.defaultProps = {
  rightIcon: undefined,
  rightText: undefined,
  style: {},
  LinkElement: undefined,
  linkProps: {},
};
