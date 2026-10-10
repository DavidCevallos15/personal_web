import { Children, isValidElement, type FC, type ReactElement, type ReactNode } from 'react';
import clsx from 'clsx';

export interface StickyTabItemProps {
  title: string;
  id: string | number;
  children: ReactNode;
}

const StickyTabItem: FC<StickyTabItemProps> = () => {
  return null;
};

export interface StickyTabsProps {
  children: ReactNode;
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

export const StickyTabs: FC<StickyTabsProps> & { Item: FC<StickyTabItemProps> } = ({
  children,
  mainNavHeight = '4em',
  rootClassName = "bg-obsidian text-text-primary",
  navSpacerClassName = "",
  sectionClassName = "bg-obsidian",
  stickyHeaderContainerClassName = "",
  headerContentWrapperClassName = "border-y border-border bg-obsidian/85 backdrop-blur-md",
  headerContentLayoutClassName = "container-lg py-4",
  titleClassName = "my-0 font-display text-3xl uppercase leading-none tracking-wide md:text-5xl",
  contentLayoutClassName = "w-full pt-10",
}) => {
  const stickyTopValue = `calc(${mainNavHeight} - 1px)`;
  const navHeightStyle = { height: mainNavHeight };
  const stickyHeaderStyle = { top: stickyTopValue };

  return (
    <div className={clsx("overflow-clip", rootClassName)}>
      {navSpacerClassName && (
        <div className={clsx("sticky left-0 top-0 z-20 w-full", navSpacerClassName)} style={navHeightStyle} aria-hidden="true" />
      )}

      {Children.map(children, (child) => {
        if (!isValidElement(child) || child.type !== StickyTabItem) {
          if (import.meta.env.DEV && child != null) {
            console.warn('StickyTabs component expects <StickyTabs.Item> components as direct children.');
          }
          return null;
        }

        const itemElement = child as ReactElement<StickyTabItemProps>;
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
