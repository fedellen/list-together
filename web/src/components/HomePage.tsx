// import { useStateValue } from 'src/state/state';
import SignInButton from './shared/SignInButton';
import HomePageIllustration from './svg/list/HomePageIllustration';
import GitHubIcon from './svg/social/GitHubIcon';
import KofiIcon from './svg/social/KofiIcon';

/** Landing page for visitors while not logged in */

export default function HomePage() {
  return (
    <div id="home">
      <section className="">
        {/** Hero image splash background */}
        <div className="content grid grid-cols-1 lg:grid-cols-2 lg:gap-24 items-center justify-center justify-items-center ">
          <HomePageIllustration />
          <div className="flex flex-col justify-center">
            <h1 className="">Sharable Grocery List App For Families</h1>
            <p>
              List Together is a simple, modern list app built with sharing
              capabilities. Completely free to use and{' '}
              <a
                className="home-link"
                href="https://github.com/fedellen/list-together"
              >
                open source.
              </a>
            </p>
            <span className="mb-2 ml-2 mt-8  lg:mt-12 xl:mt-16 text-xxs font-bold">
              Easy Login / Sign up :
            </span>
            <div className="flex flex-wrap gap-4 items-center">
              <SignInButton type="google" />
              <SignInButton type="twitter" />
              <SignInButton type="facebook" />
            </div>
          </div>
        </div>
      </section>

      <section id="features-crud" className="py-24 bg-gray-400">
        <div className="lg:flex lg:items-center lg:gap-36 content">
          <div className="w-64 h-64 lg:flex-shrink-0 bg-gray-300">
            Gif/Mp4 in action
          </div>
          <div className="py-8 ">
            <h2>Simple, modern, functional.</h2>
            <p>
              List Together provides an easy to use interface to create and
              manage your lists. Clicking or tapping on items will allow users
              to add, strike, and delete item&rsquo;s from their list. Most list
              actions are stored locally to be used in undo functionality.
            </p>
          </div>
        </div>
      </section>
      <section id="features-share" className="py-24 bg-gray-300">
        <div className="lg:flex lg:items-center lg:gap-36 content">
          <div className="w-64 h-64 lg:flex-shrink-0 bg-gray-400">
            Gif/Mp4 in action
          </div>
          <div className="py-8 lg:order-first">
            <h2>Share and Collaborate</h2>
            <p>
              Users can easily share their lists with friends via email address.
              The shared user must first create an account for the server to
              accept it as a sharable email address. List owners may also choose
              to limit the privileges of any user to provide only the access
              that user needs.
            </p>
          </div>
        </div>
      </section>
      <section id="features-share" className="py-24 bg-gray-400">
        <div className="lg:flex lg:items-center lg:gap-36 content">
          <div className="w-64 h-64 lg:flex-shrink-0 bg-gray-300">
            Gif/Mp4 in action
          </div>
          <div className="py-8 ">
            <h2>Simple, modern, functional.</h2>
            <p className="mt-4">
              List Together provides an easy to use interface to create and
              manage your lists. Clicking or tapping on items will allow users
              to add, strike, and delete item&rsquo;s from their list.
            </p>
          </div>
        </div>
      </section>

      <section id="login" className="bg-gray-300">
        <div className="content xl:flex xl:gap-20">
          <div>
            <h2>Easy Login / Sign-up</h2>
            <p>
              Not another account to create, no passwords to remember. Simply
              login with your preferred social media provider. There are no
              marketing emails attached to this service, no mailing lists to opt
              out of.{' '}
            </p>
          </div>
          <div className="flex flex-wrap flex-shrink-0 gap-4 items-center justify-items-center mt-16">
            <SignInButton type="google" />
            <SignInButton type="twitter" />
            <SignInButton type="facebook" />
          </div>
        </div>
      </section>

      <section className="bg-gray-400">
        <div className="content xl:flex xl:gap-40">
          <div>
            <h2>Open Source</h2>
            <p>
              List Together is free to use and it&rsquo;s code is open source on
              GitHub under the MIT license. Contributions to the project and
              forks are more than welcome. Information on how to contribute can
              be found at the{' '}
              <a
                className="home-link "
                href="https://github.com/fedellen/list-together"
              >
                project&rsquo;s repo.
              </a>{' '}
              You can support the project or help us pay server costs by{' '}
              <a
                className="home-link"
                href="https://ko-fi.com/pixelpajamastudios"
              >
                tipping us a Kofi
              </a>
              .
            </p>
          </div>
          <div className="flex justify-around xl:gap-24 flex-shrink-0 mt-12 sm:mt-16 md:mt-24 xl:order-first ">
            <div className="w-20 sm:w-24 hover-grow">
              <a href="https://ko-fi.com/pixelpajamastudios">
                <KofiIcon />
              </a>
            </div>
            <div className="w-20 sm:w-24 hover-grow xl:order-first">
              <a href="https://github.com/fedellen/list-together">
                <GitHubIcon />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="content  flex flex-col justify-center gap-4">
          <h2>About Pixel Pajama Studios</h2>
          <p>
            Pixel Pajama Studios is a tiny indie design and development studio
            based in Minnesota, USA. Co-Founders{' '}
            <a
              href="https://pixelpajamastudios.com/abonbon.html"
              className="home-link"
            >
              Bonnie K Thompson (abonbon)
            </a>{' '}
            and{' '}
            <a
              href="https://pixelpajamastudios.com/fedellen.html"
              className="home-link"
            >
              Derek R Sonnenberg (fedellen)
            </a>{' '}
            began their pixel art journey in mid-2018. The idea to turn their
            art into games emerged shortly after. Pixel Pajama Studios has
            released two indie games:{' '}
            <a
              href="https://pixelpajamastudios.com/astraldefense.html"
              className="home-link"
            >
              Astral Defense,{' '}
            </a>
            and{' '}
            <a
              href="https://pixelpajamastudios.com/sonarsmash.html"
              className="home-link"
            >
              Sonar Smash.
            </a>{' '}
          </p>
        </div>
      </section>
    </div>
  );
}
