import React, { Children, isValidElement } from 'react';
import clsx from 'clsx';

export interface StickyTabItemProps {
  title: string;
  id: string | number;
  children: React.ReactNode;
}

const StickyTabItem: React.FC<StickyTabItemProps> = () => {
  return null;
};

export interface StickyTabsProps {
  children: React.ReactNode;
  mainNavHeight?: string;
  rootClassName?: string;
  navSpacerClassName?: string;
  sectionClassName?: string;
  stickyHeaderContainerClassName?: string;
  headerContentWrapperClassName?: string;
  headerContentLayoutClassName?: string;
  titleClassName?: string;
  contentLayoutClassName?: string;
}

export const StickyTabs: React.FC<StickyTabsProps> & { Item: React.FC<StickyTabItemProps> } = ({
  children,
  mainNavHeight = '4em',
  rootClassName = "bg-obsidian text-text-primary",
  navSpacerClassName = "border-b border-white/10 bg-obsidian",
  sectionClassName = "bg-void",
  stickyHeaderContainerClassName = "shadow-lg",
  headerContentWrapperClassName = "border-b border-t border-white/10 bg-obsidian backdrop-blur-md bg-opacity-90",
  headerContentLayoutClassName = "mx-auto max-w-[1440px] px-6 py-5",
  titleClassName = "my-0 text-2xl font-medium leading-none md:text-3xl lg:text-4xl",
  contentLayoutClassName = "w-full",
}) => {
  const stickyTopValue = `calc(${mainNavHeight} - 1px)`;
  const navHeightStyle = { height: mainNavHeight };
  const stickyHeaderStyle = { top: stickyTopValue };

  return (
    <div className={clsx("overflow-clip", rootClassName)}>
      <div
        className={clsx(
          "sticky left-0 top-0 z-20 w-full",
          navSpacerClassName
        )}
        style={navHeightStyle}
        aria-hidden="true"
      />

      {Children.map(children, (child) => {
        if (!isValidElement(child) || child.type !== StickyTabItem) {
          if (import.meta.env.DEV && child != null) {
            console.warn('StickyTabs component expects <StickyTabs.Item> components as direct children.');
          }
          return null;
        }

        const itemElement = child as React.ReactElement<StickyTabItemProps>;
        const { title, id, children: itemContent } = itemElement.props;

        return (
          <section
            key={id}
            id={id.toString()}
            className={clsx(
              "relative", // Removido overflow-clip para no romper el IntersectionObserver de whileInView
              sectionClassName
            )}
          >
            <div
              className={clsx(
                "sticky z-10 -mt-px flex flex-col",
                stickyHeaderContainerClassName
              )}
              style={stickyHeaderStyle}
            >
              <div className={clsx(headerContentWrapperClassName)}>
                <div className={clsx(headerContentLayoutClassName)}>
                  <div className="flex items-center justify-between">
                    <h2 className={clsx(titleClassName)}>
                      {title}
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            <div className={clsx(contentLayoutClassName)}>
              {itemContent}
            </div>
          </section>
        );
      })}
    </div>
  );
};

StickyTabs.Item = StickyTabItem;
