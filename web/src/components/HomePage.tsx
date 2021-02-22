// import { useStateValue } from 'src/state/state';
import SignInButton from './shared/SignInButton';

/** Landing page for visitors while not logged in */

export default function HomePage() {
  // const [, dispatch] = useStateValue();

  return (
    <>
      <section className="">
        {/** Hero image splash background */}
        <div className="content h-screen flex flex-col justify-center ">
          <h1 className="max-w-xl">Sharable Grocery List App For Families</h1>
          <div className="flex flex-wrap gap-4 mt-12 items-center">
            <SignInButton type="google" />
            <SignInButton type="twitter" />
            <SignInButton type="facebook" />
          </div>
        </div>
      </section>

      <section id="features" className="py-8 bg-gray-400">
        <div className="content flex flex-col gap-24 ">
          <div className="md:flex md:items-center md:gap-56">
            <div className="w-64 h-64 md:flex-shrink-0 bg-gray-300">
              Gif/Mp4 in action
            </div>
            <div className="py-8 ">
              <h2>Simple, modern, functional.</h2>
              <p className="text-lg mt-4">
                List Together provides an easy to use interface to create and
                manage your lists. Clicking or tapping on items will allow users
                to add, strike, and delete item&rsquo;s from their list.
              </p>
            </div>
          </div>

          <div className="md:flex md:items-center md:gap-56">
            <div className="w-64 h-64 md:flex-shrink-0 bg-gray-300">
              Gif/Mp4 in action
            </div>
            <div className="py-8 md:order-first">
              <h2>Simple, modern, functional.</h2>
              <p className="text-lg mt-4">
                List Together provides an easy to use interface to create and
                manage your lists. Clicking or tapping on items will allow users
                to add, strike, and delete item&rsquo;s from their list.
              </p>
            </div>
          </div>

          <div className="md:flex md:items-center md:gap-56">
            <div className="w-64 h-64 md:flex-shrink-0 bg-gray-300">
              Gif/Mp4 in action
            </div>
            <div className="py-8 ">
              <h2>Simple, modern, functional.</h2>
              <p className="text-lg mt-4">
                List Together provides an easy to use interface to create and
                manage your lists. Clicking or tapping on items will allow users
                to add, strike, and delete item&rsquo;s from their list.
              </p>
            </div>
          </div>

          <div className="md:flex md:items-center md:gap-56">
            <div className="w-64 h-64 md:flex-shrink-0 bg-gray-300">
              Gif/Mp4 in action
            </div>
            <div className="py-8 md:order-first">
              <h2>Simple, modern, functional.</h2>
              <p className="text-lg mt-4">
                List Together provides an easy to use interface to create and
                manage your lists. Clicking or tapping on items will allow users
                to add, strike, and delete item&rsquo;s from their list.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="content my-16 flex flex-col justify-center gap-4">
          <h2>About Pixel Pajama Studios</h2>
          <p>
            Pixel Pajama Studios is a tiny indie design and development studio
            based in Minnesota, USA. Co-Founders Bonnie Thompson (abonbon) and
            Derek Sonnenberg (fedellen) began their pixel art journey in
            mid-2018. The idea to turn their art into games emerged shortly
            after. Pixel Pajama Studios has released two indie games: Astral
            Defense, and Sonar Smash (Featured by Apple)
          </p>
        </div>
      </section>

      <section className="bg-gray-400">
        <div className="content">
          <h2>Open Source</h2>
        </div>
      </section>
    </>
  );
}
