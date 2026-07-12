/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react"

import iphone17BlueMockup from "@/assets/mockups/ip-blue.png"
import iphone17OrangeMockup from "@/assets/mockups/ip-orange.png"
import iphone17SilverMockup from "@/assets/mockups/ip-silver.png"
import { cn } from "@/lib/utils"

type IphoneMockupVariant = "silver" | "blue" | "orange"

type IphoneMockupProps = {
  children: ReactNode
  className?: string
  screenClassName?: string
  contentClassName?: string
  variant?: IphoneMockupVariant
  overlayColor?: string
  statusBarColor?: string
  islandColor?: string
  homeBarColor?: string
  showStatusBar?: boolean
  showIsland?: boolean
  showHomeBar?: boolean
}

const DEVICE_ASPECT_RATIO = "450/920"

const SCREEN_INSET = {
  left: "5.3%",
  right: "5.3%",
  top: "2.45%",
  bottom: "2.5%",
  borderRadius: "1rem",
} as const

const MOCKUP_ASSETS: Record<IphoneMockupVariant, string> = {
  silver: iphone17SilverMockup,
  blue: iphone17BlueMockup,
  orange: iphone17OrangeMockup,
}

const STATUS_BAR_ICONS_PATH =
  "M310.736 56.5815C311.036 56.5816 311.305 56.6515 311.555 56.8013C311.805 56.9513 312.006 57.1519 312.156 57.4019C312.306 57.6517 312.375 57.9215 312.375 58.2212V59.6919C312.375 59.9916 312.306 60.2614 312.156 60.5112C312.006 60.7612 311.805 60.9618 311.555 61.1118C311.305 61.2616 311.036 61.3315 310.736 61.3315C310.436 61.3315 310.156 61.2617 309.906 61.1118C309.656 60.9618 309.455 60.7612 309.305 60.5112C309.155 60.2614 309.086 59.9916 309.085 59.6919V58.2212C309.085 57.9215 309.155 57.6517 309.305 57.4019C309.455 57.1519 309.656 56.9513 309.906 56.8013C310.156 56.6514 310.436 56.5815 310.736 56.5815ZM316.085 54.3618C316.385 54.3618 316.656 54.4315 316.906 54.5815C317.156 54.7315 317.355 54.9314 317.505 55.1812C317.655 55.4312 317.725 55.7015 317.725 56.0015V59.6919C317.725 59.9917 317.655 60.2614 317.505 60.5112C317.355 60.7612 317.156 60.9618 316.906 61.1118C316.656 61.2618 316.385 61.3315 316.085 61.3315C315.785 61.3315 315.505 61.2618 315.255 61.1118C315.005 60.9618 314.806 60.7612 314.656 60.5112C314.506 60.2614 314.435 59.9817 314.435 59.6919V56.0015C314.435 55.7015 314.506 55.4312 314.656 55.1812C314.806 54.9314 315.006 54.7315 315.255 54.5815C315.505 54.4315 315.785 54.3618 316.085 54.3618ZM326.776 49.0015C327.076 49.0015 327.345 49.0714 327.595 49.2212C327.845 49.3712 328.046 49.5718 328.196 49.8218C328.346 50.0716 328.415 50.3414 328.416 50.6411V59.6919C328.415 59.9916 328.346 60.2614 328.196 60.5112C328.046 60.7612 327.845 60.9618 327.595 61.1118C327.345 61.2616 327.076 61.3315 326.776 61.3315C326.476 61.3315 326.196 61.2616 325.946 61.1118C325.696 60.9618 325.495 60.7612 325.345 60.5112C325.195 60.2614 325.126 59.9916 325.125 59.6919V50.6411C325.126 50.3414 325.195 50.0716 325.345 49.8218C325.495 49.5718 325.696 49.3712 325.946 49.2212C326.196 49.0713 326.476 49.0015 326.776 49.0015ZM321.435 51.7915C321.735 51.7915 322.005 51.8613 322.255 52.0112C322.505 52.1612 322.705 52.3618 322.855 52.6118C323.005 52.8617 323.076 53.1313 323.076 53.4312V59.6812C323.076 59.9812 323.005 60.2515 322.855 60.5015C322.705 60.7513 322.505 60.9511 322.255 61.1011C322.005 61.2511 321.735 61.3218 321.435 61.3218C321.135 61.3217 320.855 61.2617 320.605 61.1118C320.355 60.9718 320.155 60.7712 320.005 60.5112C319.855 60.2613 319.786 59.9811 319.786 59.6812V53.4312C319.786 53.1314 319.856 52.8616 320.005 52.6118C320.155 52.3619 320.355 52.1612 320.605 52.0112C320.855 51.8613 321.135 51.7916 321.435 51.7915Z"
const WIFI_PATH =
  "M335.774 53.7693C336.193 54.2006 336.847 54.1267 337.377 53.6584C339.127 52.0809 341.31 51.2676 343.751 51.2676C346.192 51.2676 348.386 52.1056 350.125 53.6584C350.642 54.139 351.296 54.1883 351.727 53.7693C352.159 53.3256 352.22 52.6602 351.777 52.1919C349.927 50.3063 346.907 49 343.751 49C340.595 49 337.562 50.3186 335.725 52.2042C335.281 52.6602 335.33 53.3256 335.774 53.7816V53.7693ZM338.819 56.8626C339.3 57.3309 339.916 57.2816 340.459 56.8379C341.347 56.1355 342.53 55.6548 343.751 55.6672C344.959 55.6672 346.142 56.1355 347.042 56.8502C347.585 57.2939 348.226 57.3185 348.694 56.8502C349.151 56.3819 349.225 55.6672 348.744 55.2235C347.548 54.1513 345.748 53.3996 343.763 53.3996C341.778 53.3996 339.966 54.1513 338.782 55.2235C338.363 55.6179 338.277 56.2957 338.832 56.8626H338.819ZM342.937 60.954C343.467 61.4593 344.022 61.4593 344.552 60.954L345.551 59.9928C346.081 59.4752 346.192 58.822 345.588 58.3784C345.082 58.021 344.441 57.7868 343.751 57.7868C343.06 57.7868 342.407 58.021 341.914 58.3907C341.31 58.822 341.433 59.4875 341.963 59.9928L342.949 60.954H342.937Z"
const BATTERY_PATH =
  "M385.084 52.9865V56.9957C385.484 56.8855 386.415 55.9934 386.415 54.9911C386.415 53.9888 385.484 53.0967 385.084 52.9865ZM384.083 56.1638C384.083 56.3743 384.083 56.5848 384.083 56.7953C384.083 56.9757 384.083 57.1461 384.083 57.3265C384.073 57.7174 384.053 58.0983 383.983 58.4892C383.913 58.8801 383.803 59.2409 383.623 59.5917C383.443 59.9425 383.213 60.2532 382.943 60.5239C382.673 60.7945 382.353 61.025 382.012 61.2054C381.662 61.3859 381.302 61.4961 380.912 61.5663C380.532 61.6364 380.142 61.6565 379.751 61.6665C379.571 61.6665 379.401 61.6665 379.221 61.6665C379.011 61.6665 378.801 61.6665 378.591 61.6665H364.574C364.364 61.6665 364.154 61.6665 363.944 61.6665C363.764 61.6665 363.594 61.6665 363.414 61.6665C363.023 61.6565 362.643 61.6364 362.253 61.5663C361.863 61.4961 361.503 61.3859 361.153 61.2054C360.812 61.025 360.492 60.7945 360.222 60.5239C359.952 60.2532 359.722 59.9325 359.542 59.5917C359.362 59.2409 359.252 58.8801 359.182 58.4892C359.112 58.1083 359.092 57.7174 359.082 57.3265C359.082 57.1461 359.082 56.9757 359.082 56.7953C359.082 56.5848 359.082 56.3743 359.082 56.1638V54.1592C359.082 53.9487 359.082 53.7382 359.082 53.5277C359.082 53.3473 359.082 53.1769 359.082 52.9965C359.092 52.6056 359.112 52.2247 359.182 51.8438C359.252 51.4529 359.362 51.0921 359.542 50.7413C359.722 50.3905 359.952 50.0798 360.222 49.8091C360.492 49.5385 360.812 49.308 361.153 49.1276C361.503 48.9472 361.863 48.8369 362.253 48.7667C362.633 48.6966 363.023 48.6765 363.414 48.6665C363.594 48.6665 363.764 48.6665 363.944 48.6665C364.154 48.6665 364.364 48.6665 364.574 48.6665H378.581C378.791 48.6665 379.001 48.6665 379.211 48.6665C379.391 48.6665 379.561 48.6665 379.741 48.6665C380.132 48.6765 380.512 48.6966 380.902 48.7667C381.292 48.8369 381.652 48.9472 382.002 49.1276C382.353 49.308 382.663 49.5385 382.933 49.8091C383.203 50.0798 383.433 50.4005 383.613 50.7413C383.793 51.0921 383.903 51.4529 383.973 51.8438C384.043 52.2247 384.063 52.6156 384.073 52.9965C384.073 53.1769 384.073 53.3473 384.073 53.5277C384.073 53.7382 384.073 53.9487 384.073 54.1592V56.1638H384.083Z"

export default function IphoneMockup({
  children,
  className,
  screenClassName,
  contentClassName,
  variant = "silver",
  overlayColor = "#000000",
  statusBarColor,
  homeBarColor,
  showStatusBar = true,
  showIsland = true,
  showHomeBar = true,
}: IphoneMockupProps) {
  const resolvedStatusBarColor = statusBarColor ?? overlayColor
  const resolvedHomeBarColor = homeBarColor ?? overlayColor

  return (
    <div
      className={cn(
        "grid h-full w-full place-items-center overflow-hidden",
        className
      )}
    >
      <div
        className="relative h-full w-auto max-w-full shrink-0"
        style={{ aspectRatio: DEVICE_ASPECT_RATIO }}
      >
        <div
          className={cn(
            "absolute overflow-hidden bg-background shadow-inner",
            screenClassName
          )}
          style={SCREEN_INSET}
        >
          <div
            className={cn(
              "relative h-full w-full overflow-hidden",
              contentClassName
            )}
          >
            {children}
          </div>
        </div>

        <IphoneOverlay
          statusBarColor={resolvedStatusBarColor}
          homeBarColor={resolvedHomeBarColor}
          showStatusBar={showStatusBar}
          showIsland={showIsland}
          showHomeBar={showHomeBar}
        />

        <img
          src={MOCKUP_ASSETS[variant]}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-40 h-full w-full select-none"
          draggable={false}
        />
      </div>
    </div>
  )
}

function IphoneOverlay({
  statusBarColor,
  homeBarColor,
  showStatusBar,
  showIsland,
  showHomeBar,
}: {
  statusBarColor: string
  homeBarColor: string
  showStatusBar: boolean
  showIsland: boolean
  showHomeBar: boolean
}) {
  return (
    <svg
      viewBox="0 0 450 920"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
    >
      {showStatusBar ? (
        <>
          <text
            x="82"
            y="61"
            fill={statusBarColor}
            fontSize="16"
            fontWeight="600"
            letterSpacing="0"
          >
            9:41
          </text>

          <g fill={statusBarColor}>
            <path d={STATUS_BAR_ICONS_PATH} />
            <path d={WIFI_PATH} />
            <path d={BATTERY_PATH} />
          </g>
        </>
      ) : null}

      {showIsland ? (
        <rect x="162.5" y="36.6665" width="125" height="37" rx="18.5" />
      ) : null}

      {showHomeBar ? (
        <rect
          x="153"
          y="884"
          width="144"
          height="5"
          rx="2.5"
          fill={homeBarColor}
        />
      ) : null}
    </svg>
  )
}

export const iphoneMockupTuning = {
  deviceAspectRatio: DEVICE_ASPECT_RATIO,
  screenInset: SCREEN_INSET,
  variants: Object.keys(MOCKUP_ASSETS),
} as const
